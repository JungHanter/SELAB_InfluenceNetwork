package kr.ac.ssu.soft.influencenetwork;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

/**
 * Created by SEL on 2017-03-14.
 */

public class CharacterEncoding implements Filter{

    private String encoding;
    @Override
    public void destroy() {
        System.out.println("[ filter destory]");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp,
                         FilterChain filter) throws IOException, ServletException {
        System.out.println("[doFilter]" + encoding);
        req.setCharacterEncoding(encoding);
        resp.setContentType("text/html; charset=" + encoding);
        filter.doFilter(req, resp);
    }

    @Override
    public void init(FilterConfig config) throws ServletException {
        encoding = config.getInitParameter("encoding");
        System.out.println("[ filter init ] encoding"+ encoding);
    }

}
