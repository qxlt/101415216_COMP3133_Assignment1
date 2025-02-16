const { buildSchema } = require('graphql');
const User = require('./models/UserSchema')
const Emp = require('./models/EmpSchema')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken'); 
const authenticate = require('./middleware/authenticate');
const SECRET_KEY = process.env.SECRET_KEY 


// build up graphql schema
const schema = buildSchema(`

    type User {
      id: ID!
      username: String!
      email: String!
    }

    type AuthPayload {
      token: String!
      user: User!
    }

    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
    }

    type Mutation {
        signup(username: String!, password: String!, email: String!): User
        addNewEmp(
          first_name: String!, 
          last_name: String!, 
          email: String!,
          gender: String!,
          designation: String!,
          salary: Float!,
          date_of_joining: String!,
          department: String!,
          employee_photo: String
        ): Employee
        updateEmpById(eid: ID!,first_name: String!, 
          last_name: String!, 
          email: String!,
          gender: String!,
          designation: String!,
          salary: Float!,
          date_of_joining: String!,
          department: String!,
          employee_photo: String): String
        deleteEmpById(eid: ID!): String
    }

    type Query {
        login(username: String!, password: String!): AuthPayload
        getAllEmp: [Employee]
        getEmpById(eid: ID!): Employee
        getEmpByDept(keyword: String!): [Employee]

    }
  `);

// root resolver
const root = {
    // Query
    login: async ({username, password}) => {
      const user = await User.findOne({ username });
      if(!user){
        throw new Error("Invalid Credential");
      }
      const match = await bcrypt.compare(password, user.password)
      if(!match){
        throw new Error("Invalid Credential");
      }
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email }, 
        SECRET_KEY, 
        { expiresIn: '2h' }
    );
      return {token, user}
    },
    getAllEmp: async (_, req) => {
      const user = authenticate(req);
      if (!user) {
          throw new Error("Unauthorized access");
      }
      return await Emp.find({});
  },  
    getEmpById: async ({eid}, req) => {
      const user = authenticate(req);
      if (!user) {
          throw new Error("Unauthorized access");
      }
      try {
          const employee = await Emp.findById(eid);
          if (!employee) {
              throw new Error("Employee not found");
          }
          return employee;
      } catch (error) {
          throw new Error("Error fetching employee: " + error.message);
      }
    },
    getEmpByDept: async ({keyword}, req) => {
      const user = authenticate(req);
      if (!user) {
        throw new Error("Unauthorized access");
    }
      try {
        const employee = await Emp.find({
          $or: [{ department: keyword }, { designation: keyword }]
        })
        if (!employee) {
            throw new Error("Employee not found");
        }
        return employee;
      } catch (error) {
          throw new Error("Error fetching employee: " + error.message);
      }
    },
  
    // Mutation
    signup: async ({ username, password, email }) => {
      try {
        const hashed_password = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hashed_password, email });
        await newUser.save();
        return newUser;
      } catch (error) {
        throw new Error("Error signing up: " + error.message);
      }
    },
    addNewEmp: async ({ first_name, last_name, email, gender, designation, salary, 
      date_of_joining, department, employee_photo}, req) => {
        const user = authenticate(req);
        if (!user) {
          throw new Error("Unauthorized access");
        }
        try{
          const newEmp = new Emp({ first_name, last_name, email, gender, designation, salary, 
            date_of_joining, department, employee_photo })
            await newEmp.save()
            return newEmp
        }catch (error) {
        throw new Error("Error creating employee: " + error.message);
      }},
    updateEmpById: async ({ eid, first_name, last_name, email, gender, designation, salary, 
        date_of_joining, department, employee_photo }, req) => {
        const user = authenticate(req);
        if (!user) {
          throw new Error("Unauthorized access");
        }
      try {
        const updatedEmp = await Emp.findByIdAndUpdate(
          eid,
          { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo },
          { new: true }
        );
        if (!updatedEmp) {
          throw new Error("Employee not found");
        }
        return "Employee updated successfully!";
      } catch (error) {
        throw new Error("Error updating employee: " + error.message);
      }},    
    deleteEmpById: async ({ eid }, req) => {
      const user = authenticate(req);
      if (!user) {
        throw new Error("Unauthorized access");
      }
      try {
        const deletedEmp = await Emp.findByIdAndDelete(eid);
        if (!deletedEmp) {
          throw new Error("Employee not found");
        }
        return "Employee deleted successfully!";
      } catch (error) {
        throw new Error("Error deleting employee: " + error.message);
      }
    }
    





};

module.exports = { schema, root };
