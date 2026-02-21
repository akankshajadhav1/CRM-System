package com.example.demo.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import java.io.IOException;

public class JwtAuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String header = req.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("Token missing");
            return;
        }

        // fake demo role detection (later decode JWT properly)
        String role = req.getHeader("Role");

        String path = req.getRequestURI();

        // protect admin-only routes
        if (path.contains("/api/sales") &&
                !"ADMIN".equals(role)) {

            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
            res.getWriter().write("Admin access required");
            return;
        }

        chain.doFilter(request, response);
    }
}
