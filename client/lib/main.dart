import 'package:client/providers/auth_provider.dart';
import 'package:client/screens/auth/login.dart';
import 'package:client/screens/auth/register.dart';
import 'package:client/screens/home/home_screen.dart';
import 'package:client/screens/welcome/first.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

// choosing a color scheme for light mode
var kColorScheme = ColorScheme.fromSeed(
  seedColor: Colors.white,
  surface: Colors.white,
  onSurface: const Color.fromRGBO(87, 91, 95, 1),
  primaryContainer: const Color.fromRGBO(249, 249, 249, 1),
  onPrimary: const Color.fromRGBO(79, 97, 211, 1),
);

// choosing a color scheme for dark mode
var kDarkColorScheme = ColorScheme.fromSeed(
  brightness: Brightness.dark,
  seedColor: Colors.black,
  surface: const Color.fromRGBO(31, 31, 31, 1),
  onSurface: const Color.fromRGBO(255, 255, 255, 1),
  primaryContainer: const Color.fromARGB(255, 68, 18, 18),
  onPrimary: const Color.fromRGBO(79, 97, 211, 1),
);

void main() {
  // This makes the orientation of the device to be fixed
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]).then((fn) {});

  runApp(
    // Wrap app with ProviderScope for Riverpod
    const ProviderScope(child: MyApp()),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authData = ref.watch(authProvider);
    return MaterialApp(
      title: 'HandyMan',
      debugShowCheckedModeBanner: false,
      // setting the dark theme
      darkTheme: ThemeData.dark().copyWith(
        // setting the color scheme for the dark theme
        colorScheme: kDarkColorScheme,
        textTheme: GoogleFonts.robotoSlabTextTheme(
          ThemeData.dark().textTheme, // This ensures text color is white
        ),
      ),
      // setting the defualt theme which is the light theme
      theme: ThemeData().copyWith(
        // setting the color scheme for the light theme
        colorScheme: kColorScheme,

        textTheme: GoogleFonts.robotoSlabTextTheme(
          ThemeData.light().textTheme, // This ensures text color is black
        ),
      ),
      home: authData != null ? const HomeScreen() : const FirstScreen(),
      routes: {
        '/login': (context) => const Login(),
        '/register': (context) => const Register(),
        '/home': (context) => const HomeScreen(),
      },
      // choosing theme based of the systems theme
      themeMode: ThemeMode.light,
    );
  }
}
