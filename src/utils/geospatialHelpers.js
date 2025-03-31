// src/utils/geospatialHelpers.js
const { sequelize } = require('../config/database');

class GeospatialHelpers {
  // Calculate distance between two points (in kilometers)
  static async calculateDistance(point1, point2) {
    const query = `
      SELECT ST_DistanceSphere(
        ST_MakePoint(${point1.longitude}, ${point1.latitude}),
        ST_MakePoint(${point2.longitude}, ${point2.latitude})
      ) / 1000 as distance
    `;

    const [result] = await sequelize.query(query);
    return result[0].distance;
  }

  // Find events within a specific radius
  static async findEventsWithinRadius(center, radius) {
    const query = `
      SELECT *
      FROM Events
      WHERE ST_DWithin(
        location,
        ST_MakePoint(${center.longitude}, ${center.latitude})::geography,
        ${radius * 1000}
      )
    `;

    return sequelize.query(query, { 
      type: sequelize.QueryTypes.SELECT 
    });
  }

  // Convert kilometers to degrees (rough approximation)
  static kmToDegrees(kilometers) {
    // Approximate conversion (1 degree ≈ 111 km)
    return kilometers / 111;
  }
}

module.exports = GeospatialHelpers;