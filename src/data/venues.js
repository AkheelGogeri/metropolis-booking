const venues = [
  {
    id: 1,
    name: "Board Room",
    type: "Meeting Room",
    capacity: 18,
    ac: true,
    price: 5000,
    image: "https://hotelmetropolishubli.in/wp-content/uploads/2021/10/meetings.jpg",
    facilities: ["AC", "Projector", "Whiteboard", "WiFi", "TV Screen"],
    description: "Professional meeting space ideal for corporate meetings, interviews and small conferences.",
    timings: "8:00 AM - 8:00 PM",
    setupStyles: ["U Shape", "Theater", "Classroom", "Cluster", "Round Table", "Other"]
  },
  {
    id: 2,
    name: "Central Court",
    type: "Meeting Room",
    capacity: 35,
    ac: true,
    price: 8000,
    image: "https://hotelmetropolishubli.in/wp-content/uploads/2021/10/meetings.jpg",
    facilities: ["AC", "Projector", "Whiteboard", "WiFi", "Sound System"],
    description: "Spacious meeting room for mid-size corporate gatherings, training sessions and presentations.",
    timings: "8:00 AM - 8:00 PM",
    setupStyles: ["U Shape", "Theater", "Classroom", "Cluster", "Round Table", "Other"]
  },
  {
    id: 3,
    name: "East Court",
    type: "Banquet Hall",
    capacity: 50,
    ac: false,
    price: 20000,
    image: "https://hotelmetropolishubli.in/wp-content/uploads/2021/09/METROPOLIS-PARTY-HALLS-image.jpg",
    facilities: ["Parking", "Catering", "Sound System", "Decorations"],
    description: "Classic banquet hall for intimate gatherings, ceremonies and celebrations.",
    timings: "6:00 AM - 11:00 PM",
    setupStyles: ["U Shape", "Theater", "Cluster", "Round Table", "Classroom", "Other"]
  },
  {
    id: 4,
    name: "West Court",
    type: "Banquet Hall",
    capacity: 50,
    ac: true,
    price: 25000,
    image: "https://hotelmetropolishubli.in/wp-content/uploads/2021/09/METROPOLIS-BANQUETS-1.jpg",
    facilities: ["AC", "Parking", "Catering", "Sound System", "Decorations"],
    description: "Air-conditioned banquet hall perfect for corporate events, small receptions and celebrations.",
    timings: "6:00 AM - 11:00 PM",
    setupStyles: ["U Shape", "Theater", "Cluster", "Round Table", "Classroom", "Other"]
  },
  {
    id: 5,
    name: "New West Court",
    type: "Banquet Hall",
    capacity: 200,
    ac: true,
    price: 50000,
    image: "https://hotelmetropolishubli.in/wp-content/uploads/2021/09/METROPOLIS-BANQUETS-1.jpg",
    facilities: ["AC", "Parking", "Catering", "Sound System", "Projector", "Decorations"],
    description: "Grand air-conditioned hall for large weddings, receptions and corporate events up to 200 guests.",
    timings: "6:00 AM - 11:00 PM",
    setupStyles: ["U Shape", "Theater", "Cluster", "Round Table", "Classroom", "Other"]
  },
  {
    id: 6,
    name: "New East Court",
    type: "Banquet Hall",
    capacity: 200,
    ac: true,
    price: 50000,
    image: "https://hotelmetropolishubli.in/wp-content/uploads/2021/09/METROPOLIS-WEDDING-HALLS-1.jpg",
    facilities: ["AC", "Parking", "Catering", "Sound System", "Projector", "Decorations"],
    description: "Premium air-conditioned banquet hall for grand weddings, exhibitions and large corporate events.",
    timings: "6:00 AM - 11:00 PM",
    setupStyles: ["U Shape", "Theater", "Cluster", "Round Table", "Classroom", "Other"]
  }
]

export default venues