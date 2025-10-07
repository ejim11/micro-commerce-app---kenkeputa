import "package:client/screens/auth/login.dart";
import "package:client/widgets/register_form.dart";
import "package:flutter/gestures.dart";
import "package:flutter/material.dart";

class Register extends StatelessWidget {
  const Register({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
        title: const Text('Create Account'),
      ),
      body: Container(
        color: Colors.white,
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight:
                  MediaQuery.of(context).size.height -
                  AppBar().preferredSize.height -
                  MediaQuery.of(context).padding.top,
            ),
            child: IntrinsicHeight(
              child: Container(
                padding: const EdgeInsets.only(
                  top: 40,
                  bottom: 30,
                  left: 20,
                  right: 20,
                ),
                child: Column(
                  children: [
                    const RegisterForm(),
                    const SizedBox(height: 15),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 5,
                        horizontal: 15,
                      ),
                      child: RichText(
                        textAlign: TextAlign.center,
                        text: TextSpan(
                          text: 'Already have an account? ',
                          style: Theme.of(context).textTheme.bodyMedium!
                              .copyWith(
                                color: const Color.fromRGBO(134, 134, 134, 0.7),
                                fontSize: 14,
                              ),
                          children: <TextSpan>[
                            TextSpan(
                              text: 'Sign In',
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.onPrimary,
                                fontWeight: FontWeight.w500,
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () {
                                  Navigator.pushReplacement(
                                    context,
                                    MaterialPageRoute(
                                      builder: (ctx) => const Login(),
                                    ),
                                  );
                                },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
