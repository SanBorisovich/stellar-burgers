import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/ingredients/slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);

  const ingredientData = ingredients.find((ingredient) => ingredient._id == id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
