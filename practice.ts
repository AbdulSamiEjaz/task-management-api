// const users = ["122", "22323", "2132", "213213", "21323"]
// const inputUsers = ["112", "1122", "122", "22323"]

// const overlap = users.filter((user) => !inputUsers.includes(user))

// console.log(overlap)

// const array = ["slkgklsghsl", "12334", "1234", "12344444"]

// const value = "1234"

// const newArray = array.filter((val) => val !== value)

// console.log(newArray)

const users = [
  {
    id: "1",
    name: "Sami",
  },
  {
    id: "2",
    name: "Asad",
  },
  {
    id: "3",
    name: "Madni",
  },
]

const ids = ["1", "2", "3"]

for (const id of ids) {
  const user = users.find((u) => u.id === id)
  console.log(user)
}
