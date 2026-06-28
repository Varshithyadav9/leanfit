function FoodPreferences({ formData, setFormData, setPage }) {
  const groups = [
    {
      title: "Protein Sources",
      foods: ["Chicken", "Fish", "Eggs", "Mutton", "Paneer", "Dal", "Chana", "Soy"],
    },
    {
      title: "Carbohydrates",
      foods: ["Rice", "Roti", "Oats", "Poha", "Idli", "Dosa", "Potato"],
    },
    {
      title: "Dairy & Fats",
      foods: ["Milk", "Curd", "Ghee", "Butter", "Nuts", "Seeds"],
    },
    {
      title: "Supplements",
      foods: ["Whey Protein", "Creatine", "Multivitamins"],
    },
  ];

  const updateFood = (food, value) => {
    setFormData({
      ...formData,
      foods: {
        ...formData.foods,
        [food]: value,
      },
    });
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">STEP 3 OF 5</p>
        <h2>Food Preferences</h2>
        <p className="muted">
          Choose foods you prefer, accept, or want to avoid. This helps us build a realistic plan.
        </p>

        {groups.map((group) => (
          <div className="food-group" key={group.title}>
            <h3>{group.title}</h3>

            {group.foods.map((food) => (
              <div className="food-row" key={food}>
                <span>{food}</span>

                <div className="food-options">
                  {["Preferred", "Acceptable", "Avoid"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={
                        formData.foods?.[food] === option
                          ? "food-option active"
                          : "food-option"
                      }
                      onClick={() => updateFood(food, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="page-actions">
          <button className="text-btn" onClick={() => setPage("goal")}>
            Previous
          </button>

          <button className="primary-btn" onClick={() => setPage("habits")}>
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

export default FoodPreferences;