import "dart:async";

import "package:client/screens/auth/register.dart";
import "package:flutter/material.dart";

class FirstScreen extends StatefulWidget {
  const FirstScreen({super.key});

  @override
  State<FirstScreen> createState() => _FirstState();
}

class _FirstState extends State<FirstScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      // Check if the widget is still mounted before navigating

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const Register()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Colors.white),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/images/kitchen-logo.jpg',
            width: 250,
            height: 250,
          ),
          const SizedBox(height: 20),
          const CircularProgressIndicator(strokeWidth: 2),
        ],
      ),
    );
  }
}
