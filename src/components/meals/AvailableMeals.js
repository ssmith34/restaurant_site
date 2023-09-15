import { useEffect, useState } from "react";
import Card from "../ui/Card";
import MealItem from "./mealItem/MealItem";
import styles from "./AvailableMeals.module.css";

const AvailableMeals = () => {
	const [meals, setMeals] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState(null);

	useEffect(() => {
		const fetchMeals = async () => {
			const response = await fetch(
				"https://react-http-c68c4-default-rtdb.firebaseio.com/meals.json"
			);

			if (!response.ok) {
				throw new Error("Something went wrong!");
			}

			const responseData = await response.json();

			const loadedMeals = [];

			for (const key in responseData) {
				loadedMeals.push({
					id: key,
					name: responseData[key].name,
					description: responseData[key].description,
					price: responseData[key].price,
				});
			}

			setMeals(loadedMeals);
			setIsLoading(false);
		};

		fetchMeals().catch(error => {
			setIsLoading(false);
			setHttpError(error);
		});
	}, []);

	if (isLoading) {
		return (
			<section className={styles.MealsLoading}>
				<p>Yummy food is on it's way!</p>
			</section>
		);
	}

	if (httpError) {
		return (
			<section className={styles.MealsError}>
				<p>{httpError}</p>
			</section>
		);
	}

	const mealsList = meals.map(meal => (
		<MealItem
			id={meal.id}
			key={meal.id}
			name={meal.name}
			description={meal.description}
			price={meal.price}
		/>
	));

	return (
		<section className={styles.meals}>
			<Card>
				<ul>{mealsList}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
