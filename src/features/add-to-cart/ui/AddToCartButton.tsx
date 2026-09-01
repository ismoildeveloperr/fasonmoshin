import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useAddCartItemMutation,
  useCartQuery,
  useUpdateCartItemMutation,
} from "@/entities/cart";
import { getAuthUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";

type AddToCartButtonProps = {
  productId: string | number;
  disabled?: boolean;
  className?: string;
};

export const AddToCartButton = ({
  productId,
  disabled = false,
  className,
}: AddToCartButtonProps) => {
  const navigate = useNavigate();

  const currentUser = getAuthUser();

  const { data: cart = [] } = useCartQuery();

  const addCartItem = useAddCartItemMutation();

  const updateCartItem = useUpdateCartItemMutation();

  const cartItem = currentUser
    ? cart.find(
        (item) =>
          String(item.userId) === String(currentUser.id) &&
          String(item.productId) === String(productId),
      )
    : undefined;

  const isPending = addCartItem.isPending || updateCartItem.isPending;

  const handleClick = () => {
    if (!currentUser) {
      navigate(ROUTES.login);

      return;
    }

    if (
      disabled ||
      isPending ||
      productId === undefined ||
      productId === null
    ) {
      return;
    }

    if (cartItem) {
      updateCartItem.mutate({
        id: cartItem.id,
        quantity: Number(cartItem.quantity) + 1,
      });

      return;
    }

    addCartItem.mutate({
      userId: currentUser.id,
      productId,
      quantity: 1,
    });
  };

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || isPending}
      onClick={handleClick}
      aria-label="Добавить в корзину"
    >
      <ShoppingCart size={19} />
    </button>
  );
};
