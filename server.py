from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os

import student_performance


PORT = 8000

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


class MyServer(BaseHTTPRequestHandler):

    # ========================================================
    # SEND JSON
    # ========================================================

    def send_json(self, data, status=200):

        response = json.dumps(data).encode("utf-8")

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )

        self.send_header(
            "Cache-Control",
            "no-cache"
        )

        self.end_headers()

        self.wfile.write(response)


    # ========================================================
    # SERVE FILE
    # ========================================================

    def serve_file(self, filename, content_type):

        filepath = os.path.join(
            BASE_DIR,
            filename
        )

        try:

            with open(filepath, "rb") as file:

                content = file.read()


            self.send_response(200)

            self.send_header(
                "Content-Type",
                content_type
            )

            self.send_header(
                "Cache-Control",
                "no-cache"
            )

            self.end_headers()

            self.wfile.write(content)


        except FileNotFoundError:

            self.send_error(
                404,
                "File not found"
            )


    # ========================================================
    # GET REQUEST
    # ========================================================

    def do_GET(self):

        if self.path == "/":

            self.serve_file(
                "index.html",
                "text/html; charset=utf-8"
            )


        elif self.path == "/style.css":

            self.serve_file(
                "style.css",
                "text/css; charset=utf-8"
            )


        elif self.path == "/script.js":

            self.serve_file(
                "script.js",
                "application/javascript; charset=utf-8"
            )


        elif self.path == "/students":

            students = (
                student_performance
                .get_students()
            )

            self.send_json(students)


        elif self.path == "/analytics":

            analytics = (
                student_performance
                .get_analytics()
            )

            self.send_json(analytics)


        else:

            self.send_error(
                404,
                "Page not found"
            )


    # ========================================================
    # POST REQUEST
    # ========================================================

    def do_POST(self):

        try:

            content_length = int(
                self.headers.get(
                    "Content-Length",
                    0
                )
            )


            body = self.rfile.read(
                content_length
            )


            data = json.loads(
                body.decode("utf-8")
            )


            # ---------------- ADD ----------------

            if self.path == "/add":

                success, message = (
                    student_performance
                    .add_student(
                        data.get("roll_no"),
                        data.get("name"),
                        data.get("python"),
                        data.get("maths"),
                        data.get("dbms")
                    )
                )


                self.send_json({

                    "success": success,

                    "message": message

                })


            # ---------------- UPDATE ----------------

            elif self.path == "/update":

                success, message = (
                    student_performance
                    .update_student(
                        data.get("roll_no"),
                        data.get("name"),
                        data.get("python"),
                        data.get("maths"),
                        data.get("dbms")
                    )
                )


                self.send_json({

                    "success": success,

                    "message": message

                })


            # ---------------- DELETE ----------------

            elif self.path == "/delete":

                success, message = (
                    student_performance
                    .delete_student(
                        data.get("roll_no")
                    )
                )


                self.send_json({

                    "success": success,

                    "message": message

                })


            else:

                self.send_error(
                    404,
                    "API endpoint not found"
                )


        except Exception as error:

            self.send_json({

                "success": False,

                "message": str(error)

            }, 500)


# ============================================================
# START SERVER
# ============================================================

server = HTTPServer(
    ("localhost", PORT),
    MyServer
)


print()
print("============================================")
print(" Student Performance Dashboard")
print("============================================")
print()
print(
    f"Server running at: http://localhost:{PORT}"
)
print()
print("Press CTRL+C to stop the server.")
print()


server.serve_forever()