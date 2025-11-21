const isLoggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

const roleCheck = (allowedRoles = []) => {
  // allowedRoles: array of role strings (['admin']) or empty => any authenticated
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userRole = req.session.user.role;
    
    // Case-insensitive role comparison
    const userRoleLower = userRole.toLowerCase();
    const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());
    
    if (allowedRoles.length && !allowedRolesLower.includes(userRoleLower)) {
      return res.status(403).json({ 
        error: 'Access denied',
        yourRole: userRole,
        requiredRoles: allowedRoles
      });
    }
    next();
  };
};

export { isLoggedIn, roleCheck };