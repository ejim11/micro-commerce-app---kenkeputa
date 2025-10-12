import 'dart:async';

import 'package:client/models/cart_item_model.dart';
import 'package:client/providers/cart_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class QuantityControls extends ConsumerStatefulWidget {
  final CartItem item;

  const QuantityControls({super.key, required this.item});

  @override
  ConsumerState<QuantityControls> createState() => _QuantityControlsState();
}

class _QuantityControlsState extends ConsumerState<QuantityControls> {
  Timer? _debounceTimer;
  int _localQuantity = 0;
  bool _isUpdating = false;

  @override
  void initState() {
    super.initState();

    // _localQuantity = widget.item.quantity;
  }

  @override
  void didUpdateWidget(QuantityControls oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Update local quantity if the item quantity changed from outside
    if (!_isUpdating && widget.item.quantity != _localQuantity) {
      _localQuantity = widget.item.quantity;
    }
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    super.dispose();
  }

  void _onQuantityChanged(bool isIncrease) {
    setState(() {
      if (isIncrease) {
        _localQuantity++;
      } else {
        if (_localQuantity > 1) {
          _localQuantity--;
        }
      }
      _isUpdating = true;
    });

    // Cancel previous timer
    _debounceTimer?.cancel();

    // Start new timer
    _debounceTimer = Timer(const Duration(milliseconds: 500), () async {
      // Make the API call
      try {
        if (isIncrease) {
          await ref
              .read(cartProvider.notifier)
              .increaseQuantity(
                widget.item.product.id,
                _localQuantity - widget.item.quantity,
              );
        } else {
          final qty = widget.item.quantity - _localQuantity;
          await ref
              .read(cartProvider.notifier)
              .decreaseQuantity(widget.item.id, qty == 0 ? 1 : qty);
        }
      } finally {
        if (mounted) {
          setState(() {
            _isUpdating = false;
          });
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[800]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: Icon(Icons.remove, size: 18, color: Colors.grey[800]!),
            onPressed: () => _onQuantityChanged(false),
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
            padding: EdgeInsets.zero,
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              '$_localQuantity',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800]!,
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.add, size: 18, color: Colors.grey[800]!),
            onPressed: () => _onQuantityChanged(true),
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
            padding: EdgeInsets.zero,
          ),
        ],
      ),
    );
  }
}
