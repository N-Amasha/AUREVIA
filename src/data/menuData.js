export const menuCategories = [
  { value: "all", label: "All" },
  { value: "starter", label: "Starters" },
  { value: "main", label: "Main Courses" },
  { value: "dessert", label: "Desserts" },
  { value: "beverage", label: "Beverages" },
];

export const menuItems = [
  {
    id: 1,
    name: "Garden Herb Salad",
    category: "starter",
    categoryLabel: "Starter",
    description:
      "Fresh greens, seasonal vegetables and herbs served with a light dressing.",
    price: 1800,
    dietary: ["Vegetarian"],
    allergens: [],
    featured: true,
  },
  {
    id: 2,
    name: "Creamy Mushroom Soup",
    category: "starter",
    categoryLabel: "Starter",
    description:
      "A smooth mushroom soup finished with herbs and a creamy texture.",
    price: 1600,
    dietary: ["Vegetarian"],
    allergens: ["Dairy"],
    featured: false,
  },
  {
    id: 3,
    name: "Herb Grilled Chicken",
    category: "main",
    categoryLabel: "Main Course",
    description:
      "Grilled chicken seasoned with herbs and served with seasonal accompaniments.",
    price: 3200,
    dietary: [],
    allergens: [],
    featured: true,
  },
  {
    id: 4,
    name: "Vegetable Pasta",
    category: "main",
    categoryLabel: "Main Course",
    description:
      "Pasta served with seasonal vegetables, herbs and a light savoury sauce.",
    price: 2800,
    dietary: ["Vegetarian"],
    allergens: ["Gluten"],
    featured: true,
  },
  {
    id: 5,
    name: "Chocolate Dessert",
    category: "dessert",
    categoryLabel: "Dessert",
    description:
      "A rich chocolate dessert created as a sweet finish to your dining experience.",
    price: 1500,
    dietary: ["Vegetarian"],
    allergens: ["Dairy"],
    featured: false,
  },
  {
    id: 6,
    name: "Fresh Lime Cooler",
    category: "beverage",
    categoryLabel: "Beverage",
    description:
      "A refreshing lime-based beverage served chilled.",
    price: 900,
    dietary: ["Vegetarian"],
    allergens: [],
    featured: false,
  },
];