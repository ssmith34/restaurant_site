import { Fragment, useContext, useState } from "react";
import Modal from "../ui/Modal";
import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import styles from "./Cart.module.css";
import Checkout from "./Checkout";

const Cart = props => {
	const [checkingOut, setCheckingOut] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [didSubmit, setDidSubmit] = useState(false);
	const cartCtx = useContext(CartContext);

	const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
	const hasItems = cartCtx.items.length > 0;

	const cartItemRemoveHandler = id => {
		cartCtx.removeItem(id);
	};

	const cartItemAddHandler = item => {
		cartCtx.addItem({ ...item, amount: 1 });
	};

	const orderHandler = () => {
		setCheckingOut(true);
	};

	const submitOrderHandler = async userData => {
		setIsSubmitting(true);
		await fetch(
			"https://react-http-c68c4-default-rtdb.firebaseio.com/orders.json",
			{
				method: "POST",
				body: JSON.stringify({
					user: userData,
					orderedItems: cartCtx.items,
				}),
			}
		);
		setIsSubmitting(false);
		setDidSubmit(true);
		cartCtx.clearCart();
	};

	const cartItems = (
		<ul className={styles["cart-items"]}>
			{cartCtx.items.map(item => (
				<CartItem
					key={item.id}
					name={item.name}
					amount={item.amount}
					price={item.price}
					onRemove={cartItemRemoveHandler.bind(null, item.id)}
					onAdd={cartItemAddHandler.bind(null, item)}
				/>
			))}
		</ul>
	);

	const modalActions = (
		<div className={styles.actions}>
			<button className={styles["button--alt"]} onClick={props.onClose}>
				Close
			</button>
			{hasItems && (
				<button className={styles.button} onClick={orderHandler}>
					Order
				</button>
			)}
		</div>
	);

	const cartModalContent = (
		<Fragment>
			{cartItems}
			<div className={styles.total}>
				<span>Total Amount</span>
				<span>{totalAmount}</span>
			</div>
			{checkingOut && (
				<Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
			)}
			{!checkingOut && modalActions}
		</Fragment>
	);

	const isSubmittingModalContent = <p>Sending order data...</p>;

	const didSubmitModalContent = (
		<Fragment>
			<p>Success! You're order is on it's way!</p>
			<div className={styles.actions}>
				<button className={styles.button} onClick={props.onClose}>
					Close
				</button>
			</div>
		</Fragment>
	);

	return (
		<Modal onClose={props.onClose}>
			{!isSubmitting && !didSubmit && cartModalContent}
			{isSubmitting && isSubmittingModalContent}
			{!isSubmitting && didSubmit && didSubmitModalContent}
		</Modal>
	);
};

export default Cart;
