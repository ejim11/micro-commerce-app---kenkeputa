import 'package:client/enums/snackbar_type.enum.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SnackBarUtil {
  /// Shows a platform-specific snackbar
  /// iOS: Uses Cupertino style toast
  /// Android: Uses Material SnackBar
  static void show(
    BuildContext context, {
    required String message,
    Duration duration = const Duration(seconds: 2),
    SnackBarType type = SnackBarType.info,
  }) {
    if (Theme.of(context).platform == TargetPlatform.iOS) {
      _showCupertinoSnackBar(context, message, duration, type);
    } else {
      _showMaterialSnackBar(context, message, duration, type);
    }
  }

  /// Material SnackBar for Android
  static void _showMaterialSnackBar(
    BuildContext context,
    String message,
    Duration duration,
    SnackBarType type,
  ) {
    final scaffoldMessenger = ScaffoldMessenger.of(context);
    scaffoldMessenger.showSnackBar(
      SnackBar(
        content: Text(message),
        duration: duration,
        behavior: SnackBarBehavior.floating,
        backgroundColor: _getBackgroundColor(type),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  /// Cupertino style toast for iOS
  static void _showCupertinoSnackBar(
    BuildContext context,
    String message,
    Duration duration,
    SnackBarType type,
  ) {
    showCupertinoDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => CupertinoAlertDialog(
        content: Text(message),
        actions: [
          CupertinoDialogAction(
            isDefaultAction: true,
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );

    // Auto-dismiss after duration
    Future.delayed(duration, () {
      if (context.mounted) {
        Navigator.pop(context);
      }
    });
  }

  /// Get background color based on type
  static Color _getBackgroundColor(SnackBarType type) {
    switch (type) {
      case SnackBarType.success:
        return Colors.green;
      case SnackBarType.error:
        return Colors.red;
      case SnackBarType.warning:
        return Colors.orange;
      case SnackBarType.info:
        return Colors.blue;
    }
  }
}
