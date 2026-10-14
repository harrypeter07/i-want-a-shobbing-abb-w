import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { Order } from '@/types/shoe';

// Global in-memory orders fallback
let inMemoryOrders: Order[] = [
  {
    id: 'ORD-72941',
    items: [
      {
        shoeId: 'shoe-1',
        name: 'Air Velocity Pro Carbon',
        brand: 'Nike',
        price: 245,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        size: 10,
        color: 'Crimson Volt',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States',
    },
    shippingMethod: 'standard',
    shippingCost: 0,
    discount: 24.5,
    promoCode: 'KICKS20',
    subtotal: 245,
    tax: 19.6,
    total: 240.1,
    paymentMethod: 'card',
    status: 'Shipped',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    trackingNumber: 'TRK-983214892',
  },
];

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const dbOrders = await OrderModel.find().sort({ createdAt: -1 }).lean();
        if (dbOrders && dbOrders.length > 0) {
          const formatted = dbOrders.map((o: any) => ({
            id: o.orderId || o._id.toString(),
            items: o.items,
            shippingAddress: o.shippingAddress,
            shippingMethod: o.shippingMethod,
            shippingCost: o.shippingCost,
            discount: o.discount,
            promoCode: o.promoCode,
            subtotal: o.subtotal,
            tax: o.tax,
            total: o.total,
            paymentMethod: o.paymentMethod,
            status: o.status,
            trackingNumber: o.trackingNumber,
            estimatedDelivery: o.estimatedDelivery,
            createdAt: o.createdAt?.toISOString() || new Date().toISOString(),
          }));
          return NextResponse.json({ success: true, orders: formatted });
        }
      } catch (e) {
        console.warn('Orders query fallback to memory:', e);
      }
    }

    return NextResponse.json({ success: true, orders: inMemoryOrders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, shippingMethod, paymentMethod, promoCode, discount } = body;

    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'Cannot checkout with an empty cart' },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    let shippingCost = 0;
    if (shippingMethod === 'express') shippingCost = 14.99;
    if (shippingMethod === 'overnight') shippingCost = 24.99;

    const discountAmount = Number(discount) || 0;
    const tax = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
    const total = Math.max(0, subtotal - discountAmount + shippingCost + tax);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${randomNum}`;
    const trackingNumber = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const deliveryDays = shippingMethod === 'overnight' ? 1 : shippingMethod === 'express' ? 2 : 4;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
    const estimatedDelivery = estimatedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });

    const newOrder: Order = {
      id: orderId,
      items,
      shippingAddress,
      shippingMethod: shippingMethod || 'standard',
      shippingCost,
      discount: discountAmount,
      promoCode,
      subtotal,
      tax,
      total,
      paymentMethod: paymentMethod || 'card',
      status: 'Processing',
      trackingNumber,
      estimatedDelivery,
      createdAt: new Date().toISOString(),
    };

    const conn = await connectToDatabase();
    if (conn) {
      try {
        await OrderModel.create({
          orderId: newOrder.id,
          items: newOrder.items,
          shippingAddress: newOrder.shippingAddress,
          shippingMethod: newOrder.shippingMethod,
          shippingCost: newOrder.shippingCost,
          discount: newOrder.discount,
          promoCode: newOrder.promoCode,
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          total: newOrder.total,
          paymentMethod: newOrder.paymentMethod,
          status: newOrder.status,
          trackingNumber: newOrder.trackingNumber,
          estimatedDelivery: newOrder.estimatedDelivery,
        });
      } catch (err) {
        console.warn('Could not persist order to mongo, storing in memory:', err);
      }
    }

    inMemoryOrders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
