/*
Indice Rutas:
  - 0. Inicio
  - 1. Alumnos
      - 1.1 GET
        - 1.1.1 GET ALL
        - 1.1.2 GET w/ID
      - 1.2 POST
      - 1.3 PUT
      - 1.4 DELETE

  - 2. Cursos
      - 2.1 GET
        - 2.1.1 GET ALL
        - 2.1.2 GET w/ID
        - 2.1.3 GET w/descripcion
      - 2.2 POST
      - 2.3 PUT
      - 2.4 DELETE

  - 3. Usuarios
      - 3.1 GET
        - 3.1.1 GET ALL
        - 3.1.2 GET w/ID
      - 3.3 PUT
      - 3.4 DELETE

  - 4. Login y Singin
      - 4.1 Login
      - 4.2 Singin (POST USUARIOS)
*/

// requires //

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express();
const mysqlConnection = require("../database/database");

// RUTAS //

////// 0.1 //////

router.get("/", (req, res) => {
  res.send("<h1>Hi!</h1>");
});

////// 1.1.1 //////

router.get("/alumnos", tokenVerifier, (req, res) => {
  const query = "SELECT * FROM alumnos";
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje:"Error 403",
      });
      res.sendStatus(403);
    } else {
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          res.json({
            status: true,
            datos: rows,
          });
        } else {
          res.json({
            status: false,
            mensaje:"Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 1.1.2 //////

router.get("/alumnos/:id_alumno", tokenVerifier, (req, res) => {
  const params = req.params.id_alumno;
  const id_alumno = parseInt(params);

  if (isNaN(id_alumno)) {
    res.json({
      status: false,
      mensaje: "The params need to be a number",
    });
  } else {
    jwt.verify(req.token, "siliconKey", (err, valido) => {
      if (err) {
        res.json({
          status: false,
          mensaje: "Error 403",
        });
        res.sendStatus(403);
      } else {
        mysqlConnection.query(
          `SELECT * FROM alumnos WHERE id=${id_alumno}`,
          (err, rows) => {
            if (!err) {
              if (rows.length != 0) {
                res.json({
                  status:true,
                  datos:rows,
                });
              } else {
                res.json({
                  status: false,
                  mensaje: "ID not found",
                });
              }
            }else{
              res.json({
                status: false,
                mensaje:"Server error",
              });
              console.log(err);
            }
          }
        );
      }
    });
  }
});

////// 1.2 //////

router.post("/alumnos", tokenVerifier, (req, res) => {
  const { apellido, nombre, dni, sexo, fecha_nacimiento } = req.body;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `INSERT INTO alumnos(apellido,nombre,dni,sexo,fecha_nacimiento,estado,fecha_creacion)VALUES('${apellido}','${nombre}','${dni}','${sexo}','${fecha_nacimiento}','A',NOW())`;
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          res.json({
            status: true,
            mensaje: `The row was inserted correctly`,
          });
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
  console.log(req.body);
});

////// 1.3 //////

router.put("/alumnos/:id_alumno", tokenVerifier, (req, res) => {
  const { id_alumno } = req.params;
  const {
    apellido,
    nombre,
    dni,
    sexo,
    fecha_nacimiento,
    domicilio,
    estado_civil,
    fecha_modificacion,
  } = req.body;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `UPDATE alumnos SET nombre='${nombre}',apellido='${apellido}',dni='${dni}',sexo='${sexo}',fecha_nacimiento='${fecha_nacimiento}', domicilio='${domicilio}',estado_civil='${estado_civil}',fecha_modificacion=NOW() WHERE id = '${id_alumno}'`;

      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          if (rows.length!=0) {
            res.json({
              status: true,
              mensaje: `The ID (${id_alumno}) was successfully edited`,
            });
          }else{
            res.json({
              status: false,
              mensaje: "ID not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 1.4 //////

router.delete(`/alumnos/:id_alumno`, tokenVerifier, (req, res) => {
  let { id_alumno } = req.params;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `DELETE FROM alumnos WHERE id='${id_alumno}'`;
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          if (rows.length!=0) {
            res.json({
              status: true,
              mensaje: `The ID (${id_alumno}) was successfully removed`,
            });
          }else{
            res.json({
              status: false,
              mensaje: "ID not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 2.1.1 //////

router.get("/cursos", tokenVerifier, (req, res) => {
  const query = "SELECT * FROM curso";
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          res.json({
            status: true,
            datos: rows,
          });
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 2.1.2 //////

router.get("/cursos/:id_cursos", tokenVerifier, (req, res) => {
  const { id_cursos } = req.params;
  const query = `SELECT * FROM curso WHERE id_curso=${id_cursos}`;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          if (rows.length!=0) {
            res.json({
              status: true,
              datos: rows,
            });
          }else{
            res.json({
              status: false,
              mensaje: "Course not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 2.1.3 //////

router.get("/busqueda_cursos", (req, res) => {
  const { nombre } = req.body;
  let query = `SELECT * FROM curso WHERE nombre like "%${nombre}%"`
  mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          if (rows.length!=0) {
            res.json({
              status: true,
              datos: rows,
            });
          }else{
            res.json({
              status: false,
              mensaje: "Not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  );

////// 2.2 //////

router.post("/cursos", tokenVerifier, (req, res) => {
  console.log(req.body);
  const { nombre } = req.body;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `INSERT INTO curso(nombre)VALUES('${nombre}')`;
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          res.json({
            status: true,
            mensaje: `The value('${nombre}') was inserted correctly`,
          });
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 2.3 //////

router.put("/cursos/:id_cursos", tokenVerifier, (req, res) => {
  const { id_cursos } = req.params;
  let new_course_name = req.body.nombre;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `UPDATE curso SET nombre='${new_course_name}' WHERE id_curso = '${id_cursos}'`;

      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          if (rows.length!=0) {
            res.json({
              status: true,
              mensaje: "The ID was successfully edited",
            });
          }else{
            res.json({
              status: false,
              mensaje: "ID not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 2.4 //////

router.delete(`/cursos/:id_cursos`, tokenVerifier, (req, res) => {
  let { id_cursos } = req.params;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `DELETE FROM curso WHERE id_curso='${id_cursos}'`;
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          if (rows.length!=0) {
            res.json({
              status: true,
              mensaje: "The ID was successfully removed",
            });
          }else{
            res.json({
              status: false,
              mensaje: "ID not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 3.1.1 //////

router.get("/usuarios", tokenVerifier, (req, res) => {
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      const query = "SELECT * FROM usuarios";
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          res.json({
            status: true,
            datos: rows,
          });
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 3.1.2 //////

router.get(`/usuarios/:id_usuarios`, tokenVerifier, (req, res) => {
  const { id_usuarios } = req.params;
  const query = `SELECT * FROM usuarios WHERE id=${id_usuarios}`;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          if (rows.length!=0) {
            res.json({
              status: true,
              datos: rows,
            });
          }else{
            res.json({
              status: false,
              mensaje: "ID not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 3.3.1 //////

router.put("/usuarios/:id_usuarios", tokenVerifier, (req, res) => {
  const { id_usuarios } = req.params;
  let new_username = req.body.username;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `UPDATE usuarios SET username='${new_username}' WHERE id = '${id_usuarios}'`;
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          res.json({
            status: true,
            mensaje: "The ID was successfully edited",
          });
          console.log(`ID edited:${id_usuarios}; username change to '${new_username}'`)
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 3.4 //////

router.delete(`/usuarios/:id_usuarios`, tokenVerifier, (req, res) => {
  let { id_usuarios } = req.params;
  jwt.verify(req.token, "siliconKey", (err, valido) => {
    if (err) {
      res.json({
        status: false,
        mensaje: "Error 403",
      });
      res.sendStatus(403);
    } else {
      let query = `DELETE FROM usuarios WHERE id ='${id_usuarios}'`;
      mysqlConnection.query(query, (err, rows) => {
        if (!err) {
          res.json({
            status: true,
            mensaje: "The ID was successfully removed",
          });
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
          console.log(err);
        }
      });
    }
  });
});

////// 4.1 //////
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username != undefined && password != undefined) {
    mysqlConnection.query(
      'select u.id, u.username,  u.password,  u.email, u.apellido_nombre from usuarios u where u.estado="A" AND username=?',
      [username],
      (err, rows) => {
        if (!err) {
          if (rows.length != 0) {
            const bcryptPassword = bcrypt.compareSync(
              password,
              rows[0].password
            );
            if (bcryptPassword) {
              jwt.sign(
                { rows },
                "siliconKey",
                { expiresIn: "1200s" },
                (err, token) => {
                  res.json({
                    status: true,
                    datos: rows,
                    token: token,
                  });
                }
              );
            } else {
              res.json({
                status: false,
                mensaje: "Incorrect password",
              });
            }
          } else {
            res.json({
              status: false,
              mensaje: "The user was not found",
            });
          }
        } else {
          res.json({
            status: false,
            mensaje: "Server error",
          });
        }
      }
    );
  } else {
    res.json({
      status: false,
      mensaje: "Fields are missing",
    });
  }
});

////// 4.2 //////

router.post("/signin", (req, res) => {
  const { username, password, email, apellido_nombre, estado, fecha_creacion } =
    req.body;
    
  var hash = bcrypt.hashSync(password, 10);
  let query = `INSERT INTO usuarios(username, password, email, apellido_nombre, estado, fecha_creacion)VALUES('${username}','${hash}','${email}','${apellido_nombre}','A',NOW())`;
  mysqlConnection.query(query, (err, rows) => {
    if (!err) {
      res.json({
        status: true,
        mensaje: "The values was inserted correctly",
      });
    } else {
      res.json({
        status: false,
        mensaje: "Server error",
      });
      console.log(err);
    }
  });
});

////////// Token verifier/////////////////////
function tokenVerifier(req, res, next) {
  const BearerHeader = req.headers["authorization"];
  if (typeof BearerHeader !== "undefined") {
    const BearerToken = BearerHeader.split(" ")[1];
    req.token = BearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
