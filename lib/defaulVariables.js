var uuid4 = require('uuid4');
const defaultTodos = [
  {
    title: 'Set the wedding date and time.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Determine your budget.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Start researching and visiting potential wedding venues.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Choose and book your wedding venue.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Create a guest list.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Hire a wedding planner, if desired.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Book your photographer and videographer.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Start planning your wedding theme and colors.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Begin searching for the perfect wedding dress.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Book your ceremony officiant.',
    category: '12 months before the wedding',
    completed: false,
  },
  {
    title: 'Choose and book your caterer.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Book your florist.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Order save-the-date cards.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Reserve hotel accommodations for out-of-town guests.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Start planning your honeymoon.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Create a wedding website.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Start researching and booking wedding transportation.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Begin planning your rehearsal dinner.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Book your entertainment (band, DJ, etc.).',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Choose and order bridesmaids dresses.',
    category: '10 months before the wedding',
    completed: false,
  },
  {
    title: 'Order wedding invitations.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Book hair and makeup artists.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Decide on wedding favors.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Schedule engagement photoshoot.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Finalize honeymoon plans and book tickets.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Register for wedding gifts.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Start planning the ceremony and reception timelines.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Begin dance lessons if you want to learn a special dance.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Start gathering addresses for invitations.',
    category: '8 months before the wedding',
    completed: false,
  },
  {
    title: 'Send out save-the-date cards.',
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: 'Order wedding cake or dessert.',
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: 'Book any additional vendors (photo booth, etc.).',
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: `Purchase or rent groomsmen's attire.`,
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: 'Finalize the wedding guest list.',
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: 'Plan your bridal shower and bachelor/bachelorette parties.',
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: 'Start planning the ceremony program.',
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: 'Confirm details with all vendors.',
    category: '6 months before the wedding',
    completed: false,
  },
  {
    title: 'Mail out wedding invitations.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Finalize honeymoon plans and travel documents.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Arrange for transportation on the wedding day.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Schedule dress fittings.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Plan and book accommodations for the night before the wedding.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Order wedding rings.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Purchase wedding party gifts.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Plan a seating chart for the reception.',
    category: '4 months before the wedding',
    completed: false,
  },
  {
    title: 'Attend final dress fittings.',
    category: '3 months before the wedding',
    completed: false,
  },
  {
    title: 'Create a day-of timeline for the wedding party and vendors.',
    category: '3 months before the wedding',
    completed: false,
  },
  {
    title: 'Confirm details with all vendors (again).',
    category: '3 months before the wedding',
    completed: false,
  },
  {
    title: 'Purchase or make decorations and centerpieces.',
    category: '3 months before the wedding',
    completed: false,
  },
  {
    title: 'Finalize vows and ceremony readings.',
    category: '3 months before the wedding',
    completed: false,
  },
  {
    title: 'Apply for a marriage license.',
    category: '2 months before the wedding',
    completed: false,
  },
  {
    title: 'Send rehearsal dinner invitations.',
    category: '2 months before the wedding',
    completed: false,
  },
  {
    title: 'Purchase wedding accessories (veil, shoes, etc.).',
    category: '2 months before the wedding',
    completed: false,
  },
  {
    title: 'Confirm all details with your hair and makeup artists.',
    category: '2 months before the wedding',
    completed: false,
  },
  {
    title: 'Arrange for someone to take care of your pets during the wedding.',
    category: '2 months before the wedding',
    completed: false,
  },
  {
    title: `Follow up with any guests who have not RSVP'd.`,
    category: '1 months before the wedding',
    completed: false,
  },
  {
    title: 'Attend the final wedding rehearsal.',
    category: '1 months before the wedding',
    completed: false,
  },
  {
    title: `Pick up your wedding dress and groom's attire.`,
    category: '1 months before the wedding',
    completed: false,
  },
  {
    title:
      'Finalize the seating chart and provide it to the venue and caterer.',
    category: '1 months before the wedding',
    completed: false,
  },
  {
    title: 'Confirm final headcount with the caterer.',
    category: '1 months before the wedding',
    completed: false,
  },
  {
    title: `Prepare final payments for vendors.`,
    category: '2 weeks before the wedding',
    completed: false,
  },
  {
    title: `Confirm all details with your wedding planner or coordinator.`,
    category: '2 weeks before the wedding',
    completed: false,
  },
  {
    title: `Prepare your wedding-day emergency kit.`,
    category: '2 weeks before the wedding',
    completed: false,
  },
  {
    title: `Pack for your honeymoon.`,
    category: '2 weeks before the wedding',
    completed: false,
  },
  {
    title: `Confirm all appointments and reservations.`,
    category: '1 week before the wedding',
    completed: false,
  },
  {
    title: `Give the final headcount to the venue and caterer.`,
    category: '1 week before the wedding',
    completed: false,
  },
  {
    title: `Delegate tasks to friends and family for the wedding day.`,
    category: '1 week before the wedding',
    completed: false,
  },
  {
    title: `Confirm the wedding day schedule with all members of the wedding party.`,
    category: '1 week before the wedding',
    completed: false,
  },
  {
    title: `Attend the rehearsal dinner.`,
    category: 'The day before the wedding',
    completed: false,
  },
  {
    title: `Give gifts to your wedding party.`,
    category: 'The day before the wedding',
    completed: false,
  },
  {
    title: `Get a good night's sleep.`,
    category: 'The day before the wedding',
    completed: false,
  },
  {
    title: `Relax and enjoy getting ready with your bridal party.`,
    category: 'The wedding day',
    completed: false,
  },
  {
    title: `Exchange letters or gifts with your partner.`,
    category: 'The wedding day',
    completed: false,
  },
  {
    title: `Take a moment for yourself before the ceremony.`,
    category: 'The wedding day',
    completed: false,
  },
  {
    title: `Get married!`,
    category: 'The wedding day',
    completed: false,
  },
  {
    title: `Send thank-you cards to guests and vendors.`,
    category: 'After the wedding',
    completed: false,
  },
  {
    title: `Arrange for the cleaning and preservation of your wedding dress.`,
    category: 'After the wedding',
    completed: false,
  },
  {
    title: `Return any rented items.`,
    category: 'After the wedding',
    completed: false,
  },
  {
    title: `Review and select photos from the photographer.`,
    category: 'After the wedding',
    completed: false,
  },
  {
    title: `Enjoy your honeymoon!`,
    category: 'After the wedding',
    completed: false,
  },
];
const defaultMenues = ['Adult', 'Children'];
const categories = {
  userId: "",
  total_estimated_amount: 2000000,
  total_final_cost: 0,
  total_paid_amount: 0,

  categories: [
    {
      name: 'Venue and Catering',
      percentage: 25,
      estimated_amount: 500000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Entertainment',
      percentage: 8,
      estimated_amount: 160000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Photography and Videography',
      percentage: 12,
      estimated_amount: 240000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Attire and Beauty',
      percentage: 10,
      estimated_amount: 200000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Flowers and Decor',
      percentage: 8,
      estimated_amount: 160000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Invitations and Stationery',
      percentage: 3,
      estimated_amount: 60000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Transportation',
      percentage: 5,
      estimated_amount: 100000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Wedding Planner/Coordinator',
      percentage: 6,
      estimated_amount: 120000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Miscellaneous Expenses',
      percentage: 4,
      estimated_amount: 80000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Contingency Fund',
      percentage: 5,
      estimated_amount: 100000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Accommodation',
      percentage: 4,
      estimated_amount: 80000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Rehearsal Dinner',
      percentage: 3,
      estimated_amount: 60000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Bachelor/Bachelorette Parties',
      percentage: 2,
      estimated_amount: 40000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Ceremony',
      percentage: 3,
      estimated_amount: 60000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
    {
      name: 'Music for Ceremony',
      percentage: 2,
      estimated_amount: 40000,
      final_cost: 0,
      paid_amount: 0,
      id: uuid4(),
    },
  ],
};
const subcategories = [
  {
    category_name: 'Venue and Catering',
    category_id: categories.categories[0].id,
    subcategory: [
      {
        subcategory_name: 'Venue rental',
        percentage: 20,
        estimated_amount: 100000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Food',
        percentage: 50,
        estimated_amount: 250000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Beverages',
        percentage: 20,
        estimated_amount: 100000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Cake/Desserts',
        percentage: 10,
        estimated_amount: 50000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 500000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Entertainment',
    category_id: categories.categories[1].id,
    subcategory: [
      {
        subcategory_name: 'DJ or Band fee',
        percentage: 50,
        estimated_amount: 80000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Lighting and sound equipment',
        percentage: 20,
        estimated_amount: 32000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Dance floor rental',
        percentage: 15,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Ceremony musicians',
        percentage: 10,
        estimated_amount: 16000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Photo booth rental',
        percentage: 5,
        estimated_amount: 8000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 160000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Photography and Videography',
    category_id: categories.categories[2].id,

    subcategory: [
      {
        subcategory_name: 'Photographer fee',
        percentage: 50,
        estimated_amount: 120000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Videographer fee',
        percentage: 30,
        estimated_amount: 72000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Engagement shoot',
        percentage: 10,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Additional hours/coverage',
        percentage: 7,
        estimated_amount: 16800,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Photo album and prints',
        percentage: 3,
        estimated_amount: 7200,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 240000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Attire and Beauty',
    category_id: categories.categories[3].id,

    subcategory: [
      {
        subcategory_name: "Bride's dress",
        percentage: 40,
        estimated_amount: 80000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: "Groom's attire",
        percentage: 30,
        estimated_amount: 60000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Accessories',
        percentage: 15,
        estimated_amount: 30000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Hair and makeup trials',
        percentage: 10,
        estimated_amount: 20000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Grooming services',
        percentage: 5,
        estimated_amount: 10000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 200000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Flowers and Decor',
    category_id: categories.categories[4].id,

    subcategory: [
      {
        subcategory_name: 'Ceremony arrangements',
        percentage: 25,
        estimated_amount: 40000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Reception centerpieces',
        percentage: 25,
        estimated_amount: 40000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Bouquets and boutonnieres',
        percentage: 20,
        estimated_amount: 32000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Aisle decorations',
        percentage: 15,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Linens and tableware',
        percentage: 15,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 160000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Invitations and Stationery',
    category_id: categories.categories[5].id,

    subcategory: [
      {
        subcategory_name: 'Invitations and RSVP cards',
        percentage: 40,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Save-the-dates',
        percentage: 20,
        estimated_amount: 12000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Programs and menus',
        percentage: 20,
        estimated_amount: 12000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Thank-you cards',
        percentage: 10,
        estimated_amount: 6000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Postage',
        percentage: 10,
        estimated_amount: 6000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 60000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Transportation',
    category_id: categories.categories[6].id,

    subcategory: [
      {
        subcategory_name: 'Limousine or car rental',
        percentage: 40,
        estimated_amount: 40000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Shuttle service for guests',
        percentage: 30,
        estimated_amount: 30000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Getaway car',
        percentage: 30,
        estimated_amount: 30000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 100000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Wedding Planner/Coordinator',
    category_id: categories.categories[7].id,

    subcategory: [
      {
        subcategory_name: 'Full planning services',
        percentage: 60,
        estimated_amount: 72000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Partial planning services',
        percentage: 25,
        estimated_amount: 30000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Day-of coordination',
        percentage: 15,
        estimated_amount: 18000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 120000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Miscellaneous Expenses',
    category_id: categories.categories[8].id,

    subcategory: [
      {
        subcategory_name: 'Guestbook',
        percentage: 20,
        estimated_amount: 16000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Unity ceremony items',
        percentage: 20,
        estimated_amount: 16000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Wedding favors',
        percentage: 20,
        estimated_amount: 16000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Gifts for vendors',
        percentage: 20,
        estimated_amount: 16000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Welcome bags',
        percentage: 20,
        estimated_amount: 16000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 80000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Contingency Fund',
    category_id: categories.categories[9].id,

    subcategory: [
      {
        subcategory_name: 'Unexpected Vendor Costs',
        percentage: 30,
        estimated_amount: 30000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Last-Minute Changes',
        percentage: 30,
        estimated_amount: 30000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Medical or Emergency Situations',
        percentage: 20,
        estimated_amount: 20000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Weather or Venue-Related Issues',
        percentage: 10,
        estimated_amount: 10000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Miscellaneous Unforeseen Expenses',
        percentage: 10,
        estimated_amount: 10000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 100000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Accommodation',
    category_id: categories.categories[10].id,

    subcategory: [
      {
        subcategory_name: 'Hotel rooms for guests',
        percentage: 60,
        estimated_amount: 48000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Bridal suite',
        percentage: 40,
        estimated_amount: 32000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 80000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Rehearsal Dinner',
    category_id: categories.categories[11].id,

    subcategory: [
      {
        subcategory_name: 'Venue rental',
        percentage: 50,
        estimated_amount: 30000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Food and beverages',
        percentage: 40,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Decorations',
        percentage: 10,
        estimated_amount: 6000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 60000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Bachelor/Bachelorette Parties',
    category_id: categories.categories[12].id,

    subcategory: [
      {
        category_name: 'Bachelor/Bachelorette Parties',
        subcategory_name: 'Activities and entertainment',
        percentage: 70,
        estimated_amount: 28000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
      },
      {
        category_name: 'Bachelor/Bachelorette Parties',
        subcategory_name: 'Transportation',
        percentage: 30,
        estimated_amount: 12000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
      },
    ],
    total_estimated_amount: 40000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Ceremony',
    category_id: categories.categories[13].id,

    subcategory: [
      {
        subcategory_name: 'Officiant fee',
        percentage: 40,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Venue rental',
        percentage: 40,
        estimated_amount: 24000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
      {
        subcategory_name: 'Ceremony decorations',
        percentage: 20,
        estimated_amount: 12000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 60000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
  {
    category_name: 'Music for Ceremony',
    category_id: categories.categories[14].id,
    subcategory: [
      {
        subcategory_name: 'Musicians or singers',
        percentage: 100,
        estimated_amount: 40000,
        final_cost: 0,
        paid_amount: 0,
        notes: '',
        id: uuid4(),
      },
    ],
    total_estimated_amount: 40000,
    total_final_cost: 0,
    total_paid_amount: 0,
    userId: "",
  },
];
module.exports = { defaultTodos, defaultMenues, categories, subcategories };

// 1. **Venue and Catering:** 25% of 20 lakh = 5 lakh
//    - Venue rental: 20% of 5 lakh = 1 lakh
//    - Food: 50% of 5 lakh = 2.5 lakh
//    - Beverages: 20% of 5 lakh = 1 lakh
//    - Cake/Desserts: 10% of 5 lakh = 50,000

// 2. **Entertainment:** 8% of 20 lakh = 1.6 lakh
//    - DJ or Band fee: 50% of 1.6 lakh = 80,000
//    - Lighting and sound equipment: 20% of 1.6 lakh = 32,000
//    - Dance floor rental: 15% of 1.6 lakh = 24,000
//    - Ceremony musicians: 10% of 1.6 lakh = 16,000
//    - Photo booth rental: 5% of 1.6 lakh = 8,000

// 3. **Photography and Videography:** 12% of 20 lakh = 2.4 lakh
//    - Photographer fee: 50% of 2.4 lakh = 1.2 lakh
//    - Videographer fee: 30% of 2.4 lakh = 72,000
//    - Engagement shoot: 10% of 2.4 lakh = 24,000
//    - Additional hours/coverage: 7% of 2.4 lakh = 16,800
//    - Photo album and prints: 3% of 2.4 lakh = 7,200

// 4. **Attire and Beauty:** 10% of 20 lakh = 2 lakh
//    - Bride's dress: 40% of 2 lakh = 80,000
//    - Groom's attire: 30% of 2 lakh = 60,000
//    - Accessories: 15% of 2 lakh = 30,000
//    - Hair and makeup trials: 10% of 2 lakh = 20,000
//    - Grooming services: 5% of 2 lakh = 10,000

// 5. **Flowers and Decor:** 8% of 20 lakh = 1.6 lakh
//    - Ceremony arrangements: 25% of 1.6 lakh = 40,000
//    - Reception centerpieces: 25% of 1.6 lakh = 40,000
//    - Bouquets and boutonnieres: 20% of 1.6 lakh = 32,000
//    - Aisle decorations: 15% of 1.6 lakh = 24,000
//    - Linens and tableware: 15% of 1.6 lakh = 24,000

// 6. **Invitations and Stationery:** 3% of 20 lakh = 60,000
//    - Invitations and RSVP cards: 40% of 60,000 = 24,000
//    - Save-the-dates: 20% of 60,000 = 12,000
//    - Programs and menus: 20% of 60,000 = 12,000
//    - Thank-you cards: 10% of 60,000 = 6,000
//    - Postage: 10% of 60,000 = 6,000

// 7. **Transportation:** 5% of 20 lakh = 1 lakh
//    - Limousine or car rental: 40% of 1 lakh = 40,000
//    - Shuttle service for guests: 30% of 1 lakh = 30,000
//    - Getaway car: 30% of 1 lakh = 30,000

// 8. **Wedding Planner/Coordinator:** 6% of 20 lakh = 1.2 lakh
//    - Full planning services: 60% of 1.2 lakh = 72,000
//    - Partial planning services: 25% of 1.2 lakh = 30,000
//    - Day-of coordination: 15% of 1.2 lakh = 18,000

// 9. **Miscellaneous Expenses:** 4% of 20 lakh = 80,000
//    - Guestbook: 20% of 80,000 = 16,000
//    - Unity ceremony items: 20% of 80,000 = 16,000
//    - Wedding favors: 20% of 80,000 = 16,000
//    - Gifts for vendors: 20% of 80,000 = 16,000
//    - Welcome bags: 20% of 80,000 = 16,000

// 10. **Contingency Fund:** 5% of 20 lakh = 1 lakh
//     - Unexpected Vendor Costs: 30% of 1 lakh = 30,000
//     - Last-Minute Changes: 30% of 1 lakh = 30,000
//     - Medical or Emergency Situations: 20% of 1 lakh = 20,000
//     - Weather or Venue-Related Issues: 10% of 1 lakh = 10,000
//     - Miscellaneous Unforeseen Expenses: 10% of 1 lakh = 10,000

// 11. **Accommodation:** 4% of 20 lakh = 80,000
//     - Hotel rooms for guests: 60% of 80,000 = 48,000
//     - Bridal suite: 40% of 80,000 = 32,000

// 12. **Rehearsal Dinner:** 3% of 20 lakh = 60,000
//     - Venue rental: 50% of 60,000 = 30,000
//     - Food and beverages: 40% of 60,000 = 24,000
//     - Decorations: 10% of 60,000 = 6,000

// 13. **Bachelor/Bachelorette Parties:** 2% of 20 lakh = 40,000
//     - Activities and entertainment: 70% of 40,000 = 28,000
//     - Transportation: 30% of 40,000 = 12,000

// 14. **Ceremony:** 3% of 20 lakh = 60,000
//     - Officiant fee: 40% of 60,000 = 24,000
//     - Venue rental: 40% of 60,000 = 24,000
//     - Ceremony decorations: 20% of 60,000 = 12,000

// 15. **Music for Ceremony:** 2% of 20 lakh = 40,000
//     - Musicians or singers: 100% of 40,000 = 40,000
