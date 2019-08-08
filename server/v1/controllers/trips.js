import TripModel from '../models/tripModel';
import idValidator from '../helpers/idValidator';
import { responseSuccess, responseError } from '../helpers/responseHelpers';

const Trip = {
  /**
  * @param {object} req
  * @param {object} res
  * @returns {object} trip object
  */
  createTrip(req, res) {
    const { body } = req;
    const trip = TripModel.createTrip(body);
    return responseSuccess(res, 201, 'Trip Successfully Created', trip);
  },
  /**
  * @param {object} req
  * @param {object} res
  * @returns {object} trips array
  */
  getAllTrips(req, res) {
    try {
      let trips = TripModel.getAllTrips();
      const { origin } = req.query;
      const { destination } = req.query;
      if (origin) {
        trips = trips.filter(trip => trip.origin.toLowerCase() === origin.toLowerCase());
      }
      if (destination) {
        trips = trips.filter(trip => trip.destination.toLowerCase() === destination.toLowerCase());
      }
      if (!trips.length) {
        return responseError(res, 404, 'There are no Trips yet!');
      }
      return responseSuccess(res, 200, 'Trips Successfully Fetched', trips);
    } catch (error) {
      return responseError(res, 500, 'Oops! Cannot retrieve trips. :(');
    }
  },

  /**
  * @param {object} req
  * @param {object} res
  * @returns {object} trip object
  */
  getOneTrip(req, res) {
    const { error } = idValidator.tripIdValidator(req.params);
    if (error) {
      return responseError(res, 400, 'The trip ID should be a number');
    }
    const tripId = parseInt(req.params.tripId, 10);
    const oneTrip = TripModel.getOneTrip(tripId);
    if (oneTrip) {
      return responseSuccess(res, 200, 'Trip Successfully Fetched', oneTrip);
    }
    return responseError(res, 404, `Cannot find trip of id: ${tripId}`);
  },

  /**
  * @param {object} req
  * @param {object} res
  * @returns {object} updated trip object
  */
  updateTrip(req, res) {
    const { error } = idValidator.tripIdValidator(req.params);
    const tripId = parseInt(req.params.tripId, 10);
    if (error) {
      return responseError(res, 400, 'The trip ID should be a number');
    }
    const oneTrip = TripModel.getOneTrip(tripId);
    if (oneTrip) {
      const { body } = req;
      const updatedTrip = TripModel.updateTrip(tripId, body);
      return responseSuccess(res, 200, 'Trip Successfully Updated', updatedTrip);
    }
    return responseError(res, 404, `Cannot find trip of id: ${tripId}`);
  },

  /**
  * @param {object} req
  * @param {object} res
  * @returns {object} cancelled trip object
  */
  cancelTrip(req, res) {
    const { error } = idValidator.tripIdValidator(req.params);
    if (error) {
      return responseError(res, 400, 'The trip ID should be a number');
    }
    const tripId = parseInt(req.params.tripId, 10);
    const oneTrip = TripModel.getOneTrip(tripId);
    const cancelStatus = { status: 9 }; // cancelled trip are assigned the status 9
    if (oneTrip) {
      const cancelledTrip = TripModel.updateTrip(tripId, cancelStatus);
      return responseSuccess(res, 200, 'Trip Successfully Cancelled', cancelledTrip);
    }
    return responseError(res, 404, `Cannot find trip of id: ${tripId}`);
  },

  /**
  * @param {object} req
  * @param {object} res
  * @returns {messgae} message Trip deleted
  */
  deleteTrip(req, res) {
    const { error } = idValidator.tripIdValidator(req.params);
    if (error) {
      return responseError(res, 400, 'The trip ID should be a number');
    }
    const tripId = parseInt(req.params.tripId, 10);
    const oneTrip = TripModel.getOneTrip(tripId);
    if (oneTrip) {
      TripModel.deleteTrip(tripId);
      return responseSuccess(res, 204, `Trip of id: ${tripId} Successfully Deleted`, {});
    }
    return responseError(res, 404, `Cannot find trip of id: ${tripId}`);
  },
};
export default Trip;
