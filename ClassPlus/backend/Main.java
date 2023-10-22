import java.sql.*;

public class Main {
    public static void main(String[] args) {
        // Database credentials
        String url = "jdbc:mysql://sql9.freemysqlhosting.net:3306/sql9654993";
        String username = "sql9654993"; // Change to your MySQL username
        String password = "jyG6f1zdxz"; // Change to your MySQL password

        // Connection object
        Connection conn = null;

        try {
            // Establish a connection
            conn = DriverManager.getConnection(url, username, password);

            // Do something with the connection (e.g., execute queries)
            // Example: Execute a simple query
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM users");

            // Process the result set
            while (rs.next()) {
                int id = rs.getInt("userId");
                String name = rs.getString("firstName");

                System.out.println("ID: " + id + ", Name: " + name);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // Close the connection
            try {
                if (conn != null && !conn.isClosed()) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}