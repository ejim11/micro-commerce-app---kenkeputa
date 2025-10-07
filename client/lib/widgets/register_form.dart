import "package:client/screens/auth/login.dart";
import "package:flutter/material.dart";
import "package:client/services/auth_service.dart";

class RegisterForm extends StatefulWidget {
  const RegisterForm({super.key});

  @override
  State<RegisterForm> createState() {
    return _RegisterFormState();
  }
}

class _RegisterFormState extends State<RegisterForm> {
  final _formKey = GlobalKey<FormState>();

  final _enteredFirstnameController = TextEditingController();
  final _enteredLastnameController = TextEditingController();
  final _enteredEmailController = TextEditingController();
  final _enteredPasswordController = TextEditingController();
  bool _passwordVisible = false;
  bool _passwordIsChanging = false;
  bool _isLoading = false;

  // password validators
  bool _passwordMinimum = false;
  bool _passwordContainsLetter = false;
  bool _passwordContainsNumber = false;
  bool _passwordContainsSpecialCharacters = false;

  void _submitCreateAccForm() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final result = await AuthService.registerUser(
        firstname: _enteredFirstnameController.text.trim(),
        lastname: _enteredLastnameController.text.trim(),
        email: _enteredEmailController.text.trim(),
        password: _enteredPasswordController.text,
      );

      setState(() {
        _isLoading = false;
      });

      if (!mounted) return;

      if (result['success']) {
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['message']),
            backgroundColor: Colors.green,
          ),
        );

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (ctx) => const Login()),
        );
      } else {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['message']),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('An unexpected error occurred. Please try again.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _checkPasswordMinimum() {
    setState(() {
      _passwordMinimum = _enteredPasswordController.text.length >= 8;
    });
  }

  void _checkPasswordContainsLetter() {
    setState(() {
      _passwordContainsLetter = RegExp(
        r'[a-zA-Z]',
      ).hasMatch(_enteredPasswordController.text);
    });
  }

  void _checkPasswordContainsNumber() {
    setState(() {
      _passwordContainsNumber = RegExp(
        r'\d',
      ).hasMatch(_enteredPasswordController.text);
    });
  }

  void _checkPasswordContainsSpecialCharacters() {
    setState(() {
      _passwordContainsSpecialCharacters = RegExp(
        r'[\W_]',
      ).hasMatch(_enteredPasswordController.text);
    });
  }

  // bool get _isPasswordValid {
  //   return _passwordMinimum &&
  //       _passwordContainsLetter &&
  //       _passwordContainsNumber &&
  //       _passwordContainsSpecialCharacters;
  // }

  @override
  void dispose() {
    _enteredFirstnameController.dispose();
    _enteredLastnameController.dispose();
    _enteredEmailController.dispose();
    _enteredPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _enteredFirstnameController,
            keyboardType: TextInputType.name,
            style: TextStyle(color: Colors.black),
            decoration: InputDecoration(
              floatingLabelBehavior: FloatingLabelBehavior.always,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(
                  color: Color.fromRGBO(0, 0, 0, 0.3),
                  width: 1,
                ),
              ),
              label: Text(
                'First Name',
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: Theme.of(context).colorScheme.onPrimary,
                  fontSize: 16,
                ),
              ),
            ),
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Please enter your first name';
              }
              if (value.trim().length < 3) {
                return 'First name must be at least 3 characters';
              }
              if (value.trim().length > 96) {
                return 'First name must be at most 96 characters';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),
          TextFormField(
            controller: _enteredLastnameController,
            keyboardType: TextInputType.name,
            style: TextStyle(color: Colors.black),
            decoration: InputDecoration(
              floatingLabelBehavior: FloatingLabelBehavior.always,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(
                  color: Color.fromRGBO(0, 0, 0, 0.3),
                  width: 1,
                ),
              ),
              label: Text(
                'Last Name',
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: Theme.of(context).colorScheme.onPrimary,
                  fontSize: 16,
                ),
              ),
            ),
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Please enter your last name';
              }
              if (value.trim().length < 3) {
                return 'Last name must be at least 3 characters';
              }
              if (value.trim().length > 96) {
                return 'Last name must be at most 96 characters';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),
          TextFormField(
            controller: _enteredEmailController,
            style: TextStyle(color: Colors.black),
            decoration: InputDecoration(
              prefixIcon: Icon(
                Icons.email,
                color: Theme.of(context).colorScheme.onPrimary,
              ),
              floatingLabelBehavior: FloatingLabelBehavior.always,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(
                  color: Color.fromRGBO(0, 0, 0, 0.3),
                  width: 1,
                ),
              ),
              label: Text(
                'Email Address',
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: Theme.of(context).colorScheme.onPrimary,
                  fontSize: 16,
                ),
              ),
            ),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Please enter your email address';
              }
              if (!RegExp(
                r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
              ).hasMatch(value.trim())) {
                return 'Please enter a valid email address';
              }
              if (value.trim().length > 96) {
                return 'Email must be at most 96 characters';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),
          TextFormField(
            controller: _enteredPasswordController,
            style: TextStyle(color: Colors.black),
            obscureText: !_passwordVisible,
            decoration: InputDecoration(
              prefixIcon: Icon(
                Icons.lock,
                color: Theme.of(context).colorScheme.onPrimary,
              ),
              suffixIcon: IconButton(
                onPressed: () {
                  setState(() {
                    _passwordVisible = !_passwordVisible;
                  });
                },
                icon: _passwordVisible
                    ? Icon(
                        Icons.visibility_off,
                        color: Theme.of(context).colorScheme.onPrimary,
                      )
                    : Icon(
                        Icons.visibility,
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
              ),
              floatingLabelBehavior: FloatingLabelBehavior.always,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(
                  color: Color.fromRGBO(0, 0, 0, 0.3),
                  width: 1,
                ),
              ),
              label: Text(
                'Password',
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: Theme.of(context).colorScheme.onPrimary,
                  fontSize: 16,
                ),
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a password';
              }
              if (value.length < 8) {
                return 'Password must be at least 8 characters';
              }
              if (value.length > 96) {
                return 'Password must be at most 96 characters';
              }
              if (!RegExp(
                r'^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$',
              ).hasMatch(value)) {
                return 'Must have at least one letter, number and special character';
              }
              return null;
            },
            onChanged: (value) {
              setState(() {
                _passwordIsChanging = true;
              });
              _checkPasswordMinimum();
              _checkPasswordContainsLetter();
              _checkPasswordContainsNumber();
              _checkPasswordContainsSpecialCharacters();
            },
          ),
          if (_passwordIsChanging) ...[
            const SizedBox(height: 15),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Password must contain:',
                    style: Theme.of(context).textTheme.bodySmall!.copyWith(
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  _buildPasswordRequirement(
                    'At least 8 characters',
                    _passwordMinimum,
                  ),
                  _buildPasswordRequirement(
                    'At least one letter',
                    _passwordContainsLetter,
                  ),
                  _buildPasswordRequirement(
                    'At least one number',
                    _passwordContainsNumber,
                  ),
                  _buildPasswordRequirement(
                    'At least one special character',
                    _passwordContainsSpecialCharacters,
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 30),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              elevation: 5,
              shadowColor: Theme.of(context).colorScheme.onPrimary,
              padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 0),
              backgroundColor: Theme.of(context).colorScheme.onPrimary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              minimumSize: const Size(double.infinity, 36),
            ),
            onPressed: _isLoading ? null : _submitCreateAccForm,
            child: _isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : Text(
                    'Sign up',
                    style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordRequirement(String text, bool isValid) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            isValid ? Icons.check_circle : Icons.radio_button_unchecked,
            size: 16,
            color: isValid ? Colors.green : Colors.grey,
          ),
          const SizedBox(width: 8),
          Text(
            text,
            style: TextStyle(
              fontSize: 12,
              color: isValid ? Colors.green : Colors.grey[700],
              fontWeight: isValid ? FontWeight.w500 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
