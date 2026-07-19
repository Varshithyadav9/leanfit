const muscleGainMeals = {
  breakfast: {
    title: "Breakfast",
    time: "7:00–8:30 AM",
    protein: "40–45 g",
    calories: "600–650 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "4 whole eggs omelette with onion, tomato and green chilli",
          "80 g oats cooked in 250 ml milk",
          "1 banana",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "3 egg bhurji",
          "2 medium chapatis",
          "250 ml milk",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "150 g paneer bhurji",
          "2 medium chapatis",
          "Cucumber and tomato salad",
        ],
      },
    ],
  },

  lunch: {
    title: "Lunch",
    time: "1:00–2:00 PM",
    protein: "45–50 g",
    calories: "700–800 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "180 g chicken curry, grilled chicken or boiled chicken",
          "200 g cooked rice",
          "150 g mixed vegetables",
          "100 g curd",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "70 g soya chunks, measured dry before cooking",
          "200 g cooked rice",
          "150 g mixed vegetables",
          "100 g curd",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "150 g paneer curry",
          "2 medium chapatis",
          "150 g mixed vegetables",
          "Cucumber and tomato salad",
        ],
      },
    ],
  },

  snack: {
    title: "Evening Snack",
    time: "5:00–6:00 PM",
    protein: "10–15 g",
    calories: "250–350 kcal",
    options: [
      {
        label: "Recommended Option",
        type: "Simple",
        items: [
          "1 banana",
          "25 g roasted peanuts",
          "200 g curd or 250 ml milk",
        ],
      },
    ],
  },

  dinner: {
    title: "Dinner",
    time: "8:00–9:00 PM",
    protein: "40–50 g",
    calories: "600–700 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "180 g fish curry or grilled fish",
          "2 medium chapatis",
          "150 g vegetable sabzi",
          "100 g curd",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "4 whole eggs as egg curry or egg bhurji",
          "2 medium chapatis",
          "150 g mixed vegetables",
          "Cucumber and tomato salad",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "70 g soya chunks, measured dry before cooking",
          "2 medium chapatis",
          "150 g mixed vegetables",
          "Cucumber and tomato salad",
        ],
      },
    ],
  },
};

const fatLossMeals = {
  breakfast: {
    title: "Breakfast",
    time: "7:00–8:30 AM",
    protein: "30–35 g",
    calories: "400–500 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "3 whole eggs omelette with vegetables",
          "50 g oats cooked in 200 ml milk",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "3 egg bhurji",
          "2 small chapatis",
          "Cucumber and tomato salad",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "120 g paneer bhurji",
          "2 small chapatis",
          "Cucumber and tomato salad",
        ],
      },
    ],
  },

  lunch: {
    title: "Lunch",
    time: "1:00–2:00 PM",
    protein: "35–45 g",
    calories: "500–600 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "150 g grilled chicken or chicken curry with light oil",
          "150 g cooked rice",
          "200 g mixed vegetables",
          "100 g curd",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "60 g soya chunks, measured dry before cooking",
          "150 g cooked rice",
          "200 g mixed vegetables",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "120 g paneer curry",
          "2 small chapatis",
          "200 g mixed vegetables",
        ],
      },
    ],
  },

  snack: {
    title: "Evening Snack",
    time: "5:00–6:00 PM",
    protein: "8–12 g",
    calories: "150–250 kcal",
    options: [
      {
        label: "Recommended Option",
        type: "Simple",
        items: [
          "1 apple or orange",
          "20 g roasted peanuts or roasted chana",
          "Green tea or black coffee without sugar",
        ],
      },
    ],
  },

  dinner: {
    title: "Dinner",
    time: "8:00–9:00 PM",
    protein: "35–45 g",
    calories: "450–550 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "150 g grilled fish or fish curry with light oil",
          "2 small chapatis",
          "200 g mixed vegetables",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "3 whole eggs as egg curry or egg bhurji",
          "2 small chapatis",
          "200 g mixed vegetables",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "60 g soya chunks, measured dry before cooking",
          "2 small chapatis",
          "200 g mixed vegetables",
        ],
      },
    ],
  },
};

const generalFitnessMeals = {
  breakfast: {
    title: "Breakfast",
    time: "7:00–8:30 AM",
    protein: "30–40 g",
    calories: "500–600 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "3 whole eggs omelette",
          "60 g oats cooked in 250 ml milk",
          "1 banana",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "3 egg bhurji",
          "2 medium chapatis",
          "250 ml milk",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "120 g paneer bhurji",
          "2 medium chapatis",
          "Cucumber and tomato salad",
        ],
      },
    ],
  },

  lunch: {
    title: "Lunch",
    time: "1:00–2:00 PM",
    protein: "35–45 g",
    calories: "600–700 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "150 g chicken curry or grilled chicken",
          "180 g cooked rice",
          "150 g mixed vegetables",
          "100 g curd",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "60 g soya chunks, measured dry before cooking",
          "180 g cooked rice",
          "150 g mixed vegetables",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "130 g paneer curry",
          "2 medium chapatis",
          "150 g mixed vegetables",
        ],
      },
    ],
  },

  snack: {
    title: "Evening Snack",
    time: "5:00–6:00 PM",
    protein: "8–12 g",
    calories: "200–300 kcal",
    options: [
      {
        label: "Recommended Option",
        type: "Simple",
        items: [
          "1 seasonal fruit",
          "25 g roasted peanuts or roasted chana",
          "200 g curd or 250 ml milk",
        ],
      },
    ],
  },

  dinner: {
    title: "Dinner",
    time: "8:00–9:00 PM",
    protein: "35–45 g",
    calories: "500–600 kcal",
    options: [
      {
        label: "Option A",
        type: "Recommended",
        items: [
          "150 g fish curry or grilled fish",
          "2 medium chapatis",
          "150 g vegetable sabzi",
        ],
      },
      {
        label: "Option B",
        type: "Budget",
        items: [
          "3 whole eggs as egg curry or egg bhurji",
          "2 medium chapatis",
          "150 g mixed vegetables",
        ],
      },
      {
        label: "Option C",
        type: "Vegetarian",
        items: [
          "60 g soya chunks, measured dry before cooking",
          "2 medium chapatis",
          "150 g mixed vegetables",
        ],
      },
    ],
  },
};

export function getMealTemplate(userData = {}) {
  const goal = String(userData.goal || "").toLowerCase();

  if (
    goal.includes("muscle") ||
    goal.includes("bulk") ||
    goal.includes("weight gain")
  ) {
    return muscleGainMeals;
  }

  if (
    goal.includes("fat") ||
    goal.includes("weight loss") ||
    goal.includes("lose")
  ) {
    return fatLossMeals;
  }

  return generalFitnessMeals;
}

export const proteinAlternatives = [
  { food: "Chicken", quantity: "150 g cooked", protein: "40–45 g" },
  { food: "Fish", quantity: "150 g cooked", protein: "30–35 g" },
  { food: "Paneer", quantity: "150 g", protein: "25–30 g" },
  { food: "Eggs", quantity: "4 whole eggs", protein: "24–28 g" },
  { food: "Soya chunks", quantity: "70 g dry", protein: "35–38 g" },
  { food: "Black chana", quantity: "180 g cooked", protein: "15–18 g" },
  { food: "Rajma", quantity: "180 g cooked", protein: "14–16 g" },
  { food: "Dal", quantity: "250 g cooked", protein: "16–20 g" },
];

export const carbAlternatives = [
  { food: "Rice", quantity: "180 g cooked", carbs: "50–55 g" },
  { food: "Chapati", quantity: "3 medium", carbs: "45–55 g" },
  { food: "Oats", quantity: "70 g dry", carbs: "45–50 g" },
  { food: "Poha", quantity: "180 g cooked", carbs: "45–50 g" },
  { food: "Upma", quantity: "180 g cooked", carbs: "40–45 g" },
  { food: "Sweet potato", quantity: "250 g cooked", carbs: "45–50 g" },
  { food: "Idli", quantity: "3 medium", carbs: "45–50 g" },
];

export const vegetables = [
  "Spinach",
  "Cabbage",
  "Beans",
  "Bottle gourd",
  "Carrot",
  "Tomato",
  "Beetroot",
  "Cucumber",
];

export const fruits = [
  "Banana",
  "Apple",
  "Orange",
  "Papaya",
  "Watermelon",
  "Guava",
];