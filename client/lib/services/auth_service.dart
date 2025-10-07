import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  // Update this to your actual API URL
  // For Android emulator use: http://10.0.2.2:3001
  // For iOS simulator use: http://localhost:3001
  // For physical device use: http://YOUR_IP_ADDRESS:3001
  static const String baseUrl = 'http://localhost:3001/api/v1';

  // Register user
  static Future<Map<String, dynamic>> registerUser({
    required String firstname,
    required String lastname,
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'firstname': firstname,
          'lastname': lastname,
          'email': email,
          'password': password,
        }),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        // Success
        return {
          'success': true,
          'data': responseData,
          'message': 'Registration successful',
        };
      } else {
        // Server returned an error
        return {
          'success': false,
          'message': responseData['message'] ?? 'Registration failed',
          'errors': responseData['errors'] ?? [],
        };
      }
    } catch (e) {
      // Network or other error
      return {
        'success': false,
        'message': 'Network error. Please check your connection and try again.',
        'error': e.toString(),
      };
    }
  }

  // Login user
  static Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/sign-in'), // Adjust endpoint as needed
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Success
        return {
          'success': true,
          'data': responseData,
          'message': 'Login successful',
        };
      } else {
        // Server returned an error
        return {
          'success': false,
          'message': responseData['message'] ?? 'Login failed',
        };
      }
    } catch (e) {
      // Network or other error
      return {
        'success': false,
        'message': 'Network error. Please check your connection and try again.',
        'error': e.toString(),
      };
    }
  }
}
