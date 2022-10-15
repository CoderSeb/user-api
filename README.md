# User API Test Case

## Time log

| Day | From    | To    | Time |
| :---:   | :---: | :---: | :---: |
| 1/10 | 15.15   | 17.00 | 1.45 |
| 2/10 | 14.30   | 15.30 | 1 |
| 10/10 | 13.15   | 20.15 | 7 |
| 15/10 | 14.00   | 18.00 | 4.30 |
| ---- | ---- | Total: | 14.15 |

[Live here](https://sebs-codetest-user-api.herokuapp.com/api)

## API documentation

All endpoints accepts and returns JSON.

### **Add User**

#### Request

`POST /api/user/signup`

Body:

```json
{
    "firstName": "Test",
    "lastName": "Testsson",
    "email": "test.testsson@test.com",
    "pass": "APasswordWithMinLengthOf8"
}
```

#### Response

Code: 201 - Created

```json
{
  "message": "User created successfully!"
}
```

### **Login user**

#### Request

`POST /api/user/signin`

Body:

```json
{
    "email": "test.testsson@test.com",
    "pass": "YourPassword"
}
```

#### Response

Code: 200 - OK

```json
{
    "message": "User authenticated!",
    "accessToken": "<accessToken>"
}
```

### **Modify user**

#### Request

`PUT /api/user`

Headers:

```json
{
    "Authorization": "Bearer <accessToken>"
}
```

Body:

```json
{
    "email": "a-new-email@example.com", // Optional
    "newPass": "a-new-password", // Optional
    "fName": "another-first-name", // Optional
    "lName": "another-last-name", // Optional
    "currentPass": "YourCurrentPassword" //Required
}
```

#### Response

Code: 200 - OK

```json
{
    "message": "User updated successfully!"
}
```

### **Search for user**

#### Request

`GET /api/user/search?email=<email>`

Headers:

```json
{
    "Authorization": "Bearer <accessToken>"
}
```

#### Response

Code: 200 - OK

```json
{
    "fName": "Test",
    "lName": "Testsson",
    "email": "test.testsson@test.com"
}
```

### **Get all users**

#### Request

`GET /api/user/search`

Headers:

```json
{
    "Authorization": "Bearer <accessToken>"
}
```

#### Response

Code: 200 - OK

```json
[
    {
        "fName": "Test1",
        "lName": "Testsson1",
        "email": "test1.testsson1@test.com"
    },
    {
        "fName": "Test",
        "lName": "Testsson",
        "email": "test.testsson@test.com"
    }
]
```

### **Delete user**

#### Request

`DELETE /api/user`

Headers:

```json
{
    "Authorization": "Bearer <accessToken>"
}
```

Body:

```json
{
    "pass": "YourPassword"
}
```

#### Response

Code: 204 - No Content


### **Forgot password**

#### Request

`POST /api/user/forgot-pass`

Body:

```json
{
    "email": "test.testsson@test.com"
}
```

#### Response

Code: 200 - OK

```json
{
    "message": "Password reset link sent to test.testsson@test.com!"
}
```

##### Email sent to user

The link structure is: **FRONTEND_URL**/auth/reset-password/**resetToken**

Email body:

Reset code: 123456789

Click **here** to reset your password.

If you did not request a password reset, please ignore this email.

### **Reset password**

#### Request

`POST /api/user/reset-pass/<resetToken>`

Body:

```json
{
    "resetCode": 123456789,
    "newPass": "a-new-password"
}
```

#### Response

Code: 200 - OK

```json
{
    "message": "Password reset successfully!"
}
```
