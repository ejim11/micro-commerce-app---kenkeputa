// lib/models/order_model.dart
import 'package:client/models/product_model.dart';

class Order {
  final String id;
  final String total;
  final String status;
  final String shippingAddress;
  final String billingAddress;
  final String paymentMethod;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<OrderItem>? items;
  // final User user;

  Order({
    required this.id,
    required this.total,
    required this.status,
    required this.shippingAddress,
    required this.billingAddress,
    required this.paymentMethod,
    required this.createdAt,
    required this.updatedAt,
    this.items,
    // required this.user,
  });

  double get totalAsDouble => double.parse(total);

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      total: json['total'].toString(),
      status: json['status'],
      shippingAddress: json['shippingAddress'],
      billingAddress: json['billingAddress'],
      paymentMethod: json['paymentMethod'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      items: json['items'] != null
          ? (json['items'] as List)
                .map((item) => OrderItem.fromJson(item))
                .toList()
          : null,
      // user: json['user'] != null ? User.fromJson(json['user']) : null,
      // user: User.fromJson(json['user']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'total': total,
      'status': status,
      'shippingAddress': shippingAddress,
      'billingAddress': billingAddress,
      'paymentMethod': paymentMethod,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'items': items?.map((item) => item.toJson()).toList(),
      // 'user': user.toJson(),
    };
  }
}

class OrderItem {
  final String id;
  final int quantity;
  final String price;
  final Product product;

  OrderItem({
    required this.id,
    required this.quantity,
    required this.price,
    required this.product,
  });

  double get priceAsDouble => double.parse(price);
  double get subtotal => priceAsDouble * quantity;

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'],
      quantity: json['quantity'],
      price: json['price'].toString(),
      product: Product.fromJson(json['product']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'quantity': quantity,
      'price': price,
      'product': product.toJson(),
    };
  }
}

class CreateOrderDto {
  final String shippingAddress;
  final String billingAddress;
  final String paymentMethod;

  CreateOrderDto({
    required this.shippingAddress,
    required this.billingAddress,
    required this.paymentMethod,
  });

  Map<String, dynamic> toJson() {
    return {
      'shippingAddress': shippingAddress,
      'billingAddress': billingAddress,
      'paymentMethod': paymentMethod,
    };
  }
}
