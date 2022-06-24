import "./App.css";
import List from "./List";
import { useState,useEffect } from "react";
import { uid } from "uid";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);

  const [isUpdate, setIsUpdate] = useState({ id: null, status: false });

  const initialState = {
    nama: "",
    hp: "",
    email: "",
    alamat: "",
  }
  const [formData, setFormData] = useState(initialState);

  useEffect(()=> {
    //mengambil data
    axios.get("http://localhost:3000/contacts").then((res) =>{
      console.log(res.data);
      setContacts(res?.data ?? []);
    });
  },[]);

  function handleChange(e) {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let data = [...contacts];

    if (formData.nama === "") {
      return false;
    }
    if (formData.hp === "") {
      return false;
    }
    if (formData.email === "") {
      return false;
    }
    if (formData.alamat === "") {
      return false;
    }

    if (isUpdate.status) {
      data.forEach((contact) => {
        if (contact.id === isUpdate.id) {
          contact.nama = formData.nama;
          contact.hp = formData.hp;
          contact.email = formData.email;
          contact.alamat = formData.alamat;
        }
      });

      axios.put(`http://localhost:3000/contacts/${isUpdate.id}`,{
        nama: formData.nama,
        hp: formData.hp,
        email:formData.email,
        alamat:formData.alamat,
      }).then((res) => {
        alert("Berhasil mengedit Data!");
      });

    } else {
      let newData = {
        id: uid(),
        nama: formData.nama,
        hp: formData.hp,
        email: formData.email,
        alamat: formData.alamat,
      };
      data.push(newData);
      axios.post("http://localhost:3000/contacts", newData).then(res => {
        alert("Berhasil menyimpan data."); 
      });
    }

    //menambahkan kontak
    setContacts(data);
    setFormData(initialState);
    setIsUpdate({ id: null, status: false });
  }

  function handleEdit(id) {
    let data = [...contacts];
    let foundData = data.find((contact) => contact.id === id);
    setFormData({
      nama: foundData.nama,
      hp: foundData.hp,
      email: foundData.email,
      alamat: foundData.alamat,
    });
    setIsUpdate({ id: id, status: true });
  }

  function handleDelete(id){
    let data = [...contacts];
    let filteredData=data.filter(contact => contact.id !== id);

    axios.delete(`http://localhost:3000/contacts/${id}`).then ((res) =>{
      alert("Berhasil menghapus Data!");
    });

    setContacts(filteredData);

  }

  return (
    <div className="App">
      <h1 className="px-3 py-3">My Contact List</h1>

      <form onSubmit={handleSubmit} className="px-3 py-4">
        <div className="form-group">
          <label htmlFor="">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.nama}
            name="nama"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">No. Hp</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.hp}
            name="hp"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">Email</label>
          <input
            type="email"
            className="form-control"
            onChange={handleChange}
            value={formData.email}
            name="email"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">Alamat</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.alamat}
            name="alamat"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Save
          </button>
        </div>
      </form>

      <List handleDelete={handleDelete} handleEdit={handleEdit} data={contacts} />
    </div>
  );
}

export default App;
