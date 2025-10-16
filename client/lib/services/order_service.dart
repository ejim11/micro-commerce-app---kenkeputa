// lib/services/order_service.dart
import 'dart:convert';
import 'package:client/models/order_model.dart';
import 'package:http/http.dart' as http;

class OrderService {
  static const String baseUrl = 'http://localhost:3001/api/v1';

  // Create order
  static Future<Map<String, dynamic>> createOrder({
    required CreateOrderDto orderData,
    required String accessToken,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/orders');

      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      };

      final response = await http.post(
        uri,
        headers: headers,
        body: jsonEncode(orderData.toJson()),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 201) {
        final order = Order.fromJson(responseData['data']);
        return {
          'success': true,
          'data': order,
          'message': 'Order created successfully',
        };
      } else {
        return {
          'success': false,
          'message':
              responseData['details']['error'] ?? 'Failed to create order',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error. Please check your connection and try again.',
        'error': e.toString(),
      };
    }
  }

  // Get all orders
  static Future<Map<String, dynamic>> getOrders({
    required String accessToken,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/orders');

      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      };

      final response = await http.get(uri, headers: headers);

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        // for (var orderJson in responseData['data']) {
        //   print(orderJson);
        // }

        final orders = (responseData['data'] as List)
            .map((orderJson) => Order.fromJson(orderJson))
            .toList();

        return {
          'success': true,
          'data': orders,
          'message': 'Orders fetched successfully',
        };
      } else {
        return {
          'success': false,
          'message': responseData['message'] ?? 'Failed to fetch orders',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error. Please check your connection and try again.',
        'error': e.toString(),
      };
    }
  }

  // Get single order by ID
  static Future<Map<String, dynamic>> getOrderById({
    required String orderId,
    required String accessToken,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/orders/$orderId');

      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      };

      final response = await http.get(uri, headers: headers);

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        final order = Order.fromJson(responseData['data']);
        return {
          'success': true,
          'data': order,
          'message': 'Order fetched successfully',
        };
      } else {
        return {
          'success': false,
          'message': responseData['message'] ?? 'Failed to fetch order',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error. Please check your connection and try again.',
        'error': e.toString(),
      };
    }
  }
}
