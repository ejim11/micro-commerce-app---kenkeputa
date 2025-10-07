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

  // Save auth data after login
  Future<void> setAuthData(AuthData authData) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final authDataString = jsonEncode(authData.toJson());
      await prefs.setString('authData', authDataString);
      state = authData;
    } catch (e) {
      print('Error saving auth data: $e');
    }
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
