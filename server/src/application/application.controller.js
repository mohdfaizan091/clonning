import {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
  } from "./application.services.js";
  
  export const create = async (req, res, next) => {
    try {
      const application = await createApplication(req.user.id, req.body);
      res.status(201).json({ success: true, application });
    } catch (error) {
      next(error);
    }
  };
  
  export const getAll = async (req, res, next) => {
    try {
      const result = await getApplications(req.user.id, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
  
  export const getOne = async (req, res, next) => {
    try {
      const application = await getApplicationById(req.user.id, req.params.id);
      res.status(200).json({ success: true, application });
    } catch (error) {
      next(error);
    }
  };
  
  export const update = async (req, res, next) => {
    try {
      const application = await updateApplication(req.user.id, req.params.id, req.body);
      res.status(200).json({ success: true, application });
    } catch (error) {
      next(error);
    }
  };
  
  export const remove = async (req, res, next) => {
    try {
      await deleteApplication(req.user.id, req.params.id);
      res.status(200).json({ success: true, message: "Application deleted" });
    } catch (error) {
      next(error);
    }
  };