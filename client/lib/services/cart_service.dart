// lib/services/cart_service.dart
import 'dart:convert';
import 'package:client/models/cart_model.dart';
import 'package:http/http.dart' as http;

class CartService {
  final String baseUrl = 'http://localhost:3001/api/v1';
  final String Function() getToken;

  CartService({required this.getToken});

  Map<String, String> get _headers {
    final token = getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // Get cart
  Future<Cart> getCart() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/cart'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Cart.fromJson(data['data']);
      } else {
        throw Exception('Failed to load cart: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching cart: $e');
    }
  }

  // Add to cart or increase quantity
  Future<Cart> addToCart({required String productId, int quantity = 1}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/cart'),
        headers: _headers,
        body: json.encode({'productId': productId, 'quantity': quantity}),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return Cart.fromJson(data['data']);
      } else {
        throw Exception('Failed to add to cart: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error adding to cart: $e');
    }
  }

  // Decrease quantity
  Future<Cart> decreaseQuantity(String cartItemId, int qty) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/cart/$cartItemId'),
        headers: _headers,
        body: json.encode({'quantity': qty}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Cart.fromJson(data['data']);
      } else {
        throw Exception('Failed to decrease quantity: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error decreasing quantity: $e');
    }
  }

  // Remove item from cart
  Future<Cart> removeFromCart(String cartItemId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/cart/$cartItemId'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Cart.fromJson(data['data']);
      } else {
        throw Exception('Failed to remove item: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error removing item: $e');
    }
  }

  // Clear cart
  Future<void> clearCart() async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/cart/clear'),
        headers: _headers,
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to clear cart: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error clearing cart: $e');
    }
  }
}
