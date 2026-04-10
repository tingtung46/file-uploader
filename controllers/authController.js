const isAuth = (req, res, next) => {
  req.isAuthenticated() ? next() : res.status(401).render("./error/error");
};

export default isAuth;
