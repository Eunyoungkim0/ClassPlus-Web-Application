
import java.io.IOException;
import java.sql.Date;
import javax.servlet.ServletException;
import javax.servlet.http.*;

public class SignupServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userPassword = request.getParameter("userPassword");
        String unccId = request.getParameter("unccId");
        String lastName = request.getParameter("lastName");
        String firstName = request.getParameter("firstName");
        String email = request.getParameter("email");
        String major = request.getParameter("major");
        String picture = request.getParameter("picture");
        boolean isStudent = request.getParameter("isStudent") != null;
        boolean isInstructor = request.getParameter("isInstructor") != null;
        Date signupDate = now();

        // Validate the form data and create a Signup instance
        Signup signup = new Signup(userPassword, unccId, lastName, firstName, email, major, picture, isStudent, isInstructor, signupDate);
    }
}