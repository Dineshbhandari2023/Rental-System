const Item = require("../models/item");

exports.createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      dailyPrice,
      depositAmount,
      condition,
      rules,
      availability,
      addressText,
      coordinates,
    } = req.body;

    // Handle uploaded images
    const images = req.files.map((file) => `/uploads/items/${file.filename}`);

    // Parse JSON fields sent as strings from frontend
    const parsedRules = rules ? JSON.parse(rules) : [];
    const parsedAvailability = availability ? JSON.parse(availability) : [];
    const parsedCoordinates = coordinates ? JSON.parse(coordinates) : [];

    const item = await Item.create({
      ownerId: req.user._id,
      title,
      description,
      category,
      images,
      dailyPrice: Number(dailyPrice),
      depositAmount: Number(depositAmount),
      condition: condition || "Good",
      rules: parsedRules,
      availability: parsedAvailability,
      addressText,
      location: {
        type: "Point",
        coordinates: parsedCoordinates, // [lng, lat]
      },
    });

    res.status(201).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error.message,
    });
  }
};

exports.getItems = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      lat,
      lng,
      maxDistance, // in km
      startDate,
      endDate,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    let query = { isAvailable: true };

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.dailyPrice = {};
      if (minPrice) query.dailyPrice.$gte = Number(minPrice);
      if (maxPrice) query.dailyPrice.$lte = Number(maxPrice);
    }

    // Geospatial search
    if (lat && lng && maxDistance) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(maxDistance) * 1000, // meters
        },
      };
    }

    // Basic availability overlap check
    if (startDate && endDate) {
      query.availability = {
        $elemMatch: {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Item.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("ownerId", "firstName lastName profilePicture rating");

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      items,
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "ownerId",
      "firstName lastName profilePicture rating"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
    }

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/items/${file.filename}`
      );
      item.images = [...item.images, ...newImages];
    }

    const fields = req.body;
    if (fields.rules) item.rules = JSON.parse(fields.rules);
    if (fields.availability)
      item.availability = JSON.parse(fields.availability);
    if (fields.coordinates)
      item.location.coordinates = JSON.parse(fields.coordinates);

    // Update other fields
    Object.keys(fields).forEach((key) => {
      if (!["rules", "availability", "coordinates"].includes(key)) {
        item[key] = fields[key];
      }
    });

    await item.save();

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      });
    }

    await item.remove();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
    });
  }
};
