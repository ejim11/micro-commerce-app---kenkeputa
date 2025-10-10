import 'package:client/services/auth_service.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:client/models/auth_model.dart';

// State notifier for authentication
class AuthNotifier extends StateNotifier<AuthData?> {
  AuthNotifier() : super(null) {
    _loadAuthData();
  }

  // Load auth data from local storage on app start
  Future<void> _loadAuthData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final authDataString = prefs.getString('authData');

      if (authDataString != null) {
        final authDataJson = jsonDecode(authDataString);
        state = AuthData.fromJson(authDataJson);
      }
    } catch (e) {
      print('Error loading auth data: $e');
    }
  }

  // Login user - NEW METHOD
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      // Call the auth service
      final result = await AuthService.loginUser(
        email: email,
        password: password,
      );

      // If login is successful, save auth data
      if (result['success']) {
        final authData = AuthData.fromJson(result['data']['data']);
        await _saveAuthData(authData);
      }

      return result;
    } catch (e) {
      return {
        'success': false,
        'message': 'An unexpected error occurred. Please try again.',
        'error': e.toString(),
      };
    }
  }

  // Private method to save auth data
  Future<void> _saveAuthData(AuthData authData) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final authDataString = jsonEncode(authData.toJson());
      await prefs.setString('authData', authDataString);
      state = authData;
    } catch (e) {
      print('Error saving auth data: $e');
      rethrow;
    }
  }

  // Save auth data after login - UPDATED (now just calls private method)
  Future<void> setAuthData(AuthData authData) async {
    await _saveAuthData(authData);
  }

  // Clear auth data on logout
  Future<void> clearAuthData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('authData');
      state = null;
    } catch (e) {
      print('Error clearing auth data: $e');
    }
  }

  // Get access token
  String? get accessToken => state?.accessToken;

  // Get refresh token
  String? get refreshToken => state?.refreshToken;

  // Get user
  User? get user => state?.user;

  // Check if user is authenticated
  bool get isAuthenticated => state != null;
}

// Provider for auth state
final authProvider = StateNotifierProvider<AuthNotifier, AuthData?>((ref) {
  return AuthNotifier();
});
