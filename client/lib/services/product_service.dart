import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:client/models/product_model.dart';

class ProductService {
  static const String baseUrl = 'http://localhost:3001/api/v1';

  // lib/services/product_service.dart
  static Future<Map<String, dynamic>> getProducts({
    int page = 1,
    int limit = 10,
    String? accessToken,
    String? name,
    String? category,
    String? sort,
  }) async {
    try {
      // Build query parameters
      final queryParams = <String, String>{
        'page': page.toString(),
        'limit': limit.toString(),
      };

      if (name != null && name.isNotEmpty) {
        queryParams['name'] = name;
      }

      if (category != null && category.isNotEmpty) {
        queryParams['category'] = category;
      }

      if (sort != null && sort.isNotEmpty) {
        queryParams['sort'] = sort;
      }

      final uri = Uri.parse(
        '$baseUrl/products',
      ).replace(queryParameters: queryParams);

      final headers = {
        'Content-Type': 'application/json',
        if (accessToken != null) 'Authorization': 'Bearer $accessToken',
      };

      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final productResponse = ProductResponse.fromJson(responseData);

        return {
          'success': true,
          'data': productResponse,
          'message': 'Products fetched successfully',
        };
      } else {
        final responseData = jsonDecode(response.body);
        return {
          'success': false,
          'message': responseData['message'] ?? 'Failed to fetch products',
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

  // Get single product by ID
  static Future<Map<String, dynamic>> getProductById({
    required String productId,
    String? accessToken,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/products/$productId');

      final headers = {
        'Content-Type': 'application/json',
        if (accessToken != null) 'Authorization': 'Bearer $accessToken',
      };

      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final product = Product.fromJson(responseData['data']);

        return {
          'success': true,
          'data': product,
          'message': 'Product fetched successfully',
        };
      } else {
        final responseData = jsonDecode(response.body);
        return {
          'success': false,
          'message': responseData['message'] ?? 'Failed to fetch product',
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

  // Search products
  static Future<Map<String, dynamic>> searchProducts({
    required String query,
    int page = 1,
    int limit = 10,
    String? accessToken,
  }) async {
    try {
      final uri = Uri.parse(
        '$baseUrl/products/search?q=$query&limit=$limit&page=$page',
      );

      final headers = {
        'Content-Type': 'application/json',
        if (accessToken != null) 'Authorization': 'Bearer $accessToken',
      };

      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final productResponse = ProductResponse.fromJson(responseData);

        return {
          'success': true,
          'data': productResponse,
          'message': 'Products found',
        };
      } else {
        final responseData = jsonDecode(response.body);
        return {
          'success': false,
          'message': responseData['message'] ?? 'Search failed',
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
