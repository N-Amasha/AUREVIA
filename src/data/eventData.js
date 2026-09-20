export const eventTypes = [
  { value: "all", label: "All Events" },
  { value: "wedding", label: "Weddings" },
  { value: "corporate", label: "Corporate" },
  { value: "celebration", label: "Celebrations" },
  { value: "private", label: "Private Events" },
];

export const eventExperiences = [
  {
    id: 1,
    title: "Wedding Celebration",
    type: "wedding",
    typeLabel: "Wedding",
    description:
      "A refined setting for wedding celebrations with flexible venue arrangements, dining options and coordinated event planning.",
    capacity: "Up to 150 guests",
    features: [
      "Venue arrangement",
      "Catering options",
      "Event coordination",
    ],
  },
  {
    id: 2,
    title: "Corporate Gathering",
    type: "corporate",
    typeLabel: "Corporate",
    description:
      "Professional event spaces designed for meetings, company gatherings and organized corporate dining experiences.",
    capacity: "Up to 100 guests",
    features: [
      "Flexible seating",
      "Food and beverage options",
      "Event timeline support",
    ],
  },
  {
    id: 3,
    title: "Birthday Celebration",
    type: "celebration",
    typeLabel: "Celebration",
    description:
      "Create a memorable birthday experience with customizable dining and event arrangements.",
    capacity: "Up to 80 guests",
    features: [
      "Custom dining options",
      "Venue setup",
      "Coordination support",
    ],
  },
  {
    id: 4,
    title: "Private Dinner",
    type: "private",
    typeLabel: "Private Event",
    description:
      "An intimate event experience for family occasions, private dinners and smaller gatherings.",
    capacity: "Up to 30 guests",
    features: [
      "Private setting",
      "Personalized menu options",
      "Flexible arrangements",
    ],
  },
];