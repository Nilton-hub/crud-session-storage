const btnsSelectOpt = document.querySelectorAll('.main-nav a'),
      userCrud = document.querySelector('.user-crud'),
      formRegister = document.querySelector('.user-crud form#form-register'),
      modal = document.querySelector('dialog'),
      btnModal = document.querySelector('dialog button');
let btnsDelete,
    btnsEdit;

function toggleResults() {
  const table = userCrud.querySelector('table');
  const divEmptyContent = userCrud.querySelector('.empty-content');
  if (
      window.sessionStorage.getItem('users') &&
      JSON.parse(window.sessionStorage.getItem('users')).length > 0
    ) {
    table.classList.remove('none');
    divEmptyContent.classList.add('none');
  } else {
    table.classList.add('none');
    divEmptyContent.classList.remove('none');
  }
}

toggleResults();
document.querySelectorAll('.main-nav ul a')
  .forEach(link => link.addEventListener('click', e => e.preventDefault()));

btnsSelectOpt.forEach(value => {
  value.addEventListener('click', e => {
    const order = Number.parseInt(value.dataset.order);
    btnsSelectOpt.forEach(valueLink => valueLink.classList.remove('active'));
    value.classList.add('active');
    userCrud.style.left = `-${order * 100}vw`;
    document.querySelector('h1').innerHTML = value.dataset.text;
  });
});

function addUser(data) {
  let users = [];
  const key = "users";
  if (window.sessionStorage.getItem(key)) {
    users = JSON.parse(window.sessionStorage.getItem(key));
  }
  users.push(data);
  return window.sessionStorage.setItem(key, JSON.stringify(users));
}

const sendImage = (inputFile) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => resolve(fileReader.result));
    fileReader.addEventListener('error', e => reject(e));
    fileReader.readAsDataURL(inputFile.files[0]);
  });
};

let imagePath = './avatar.jpg';
    inputPhoto = document.getElementById('photo');
const savePhoto = async e => {
  try {
    imagePath = await sendImage(inputPhoto);
    const imageProfile = document.querySelector("#img-profile");
    imageProfile.style.backgroundImage = `URL(${imagePath})`;
    imageProfile.style.borderStyle = 'solid';
  } catch (error) {
    console.error(error);
  }
};

inputPhoto.addEventListener('change', savePhoto);

function getUsers() {
  let users = window.sessionStorage.getItem("users");
  if (users) {
    users = JSON.parse(users);
    users.forEach(user => tableAddLine(user));
  }
}
getUsers();

function tableAddLine(user) {
  const line = document.createElement('tr'),
        tdName = document.createElement('td'),
        tdEmail = document.createElement('td'),
        tdPhoto = document.createElement('td'),
        tdManager = document.createElement('td'),
        btnEdit = document.createElement('button'),
        btnDelete = document.createElement('button');

  tdName.textContent = user.name;
  tdEmail.textContent = user.email;
  tdPhoto.innerHTML = `<div style="background-image: URL(${user.photo});"></div>`;

  tdName.classList.add('tdName');
  tdEmail.classList.add('tdEmail');
  tdPhoto.classList.add('tdPhoto');
  tdPhoto.classList.add("cell-photo");
  tdManager.classList.add('tdManager');
  line.classList.add("user-row");

  btnEdit.innerHTML = '<i class="bx bxs-edit"></i>';
  btnEdit.classList.add('edit');
  btnEdit.setAttribute('title', 'Editar');

  btnDelete.innerHTML = '<i class="bx bx-trash"></i>';
  btnDelete.classList.add('delete');
  btnDelete.setAttribute('title', 'Deletar');

  tdManager.append(btnEdit, btnDelete);
  line.append(tdPhoto, tdName, tdEmail, tdManager);

  document.querySelector('.user-crud table tbody').append(line);
  line.dataset.index = line.sectionRowIndex;
  handleBtnsUsersEdit();
  handleBtnsUsersdelete();
}

const handleFormUser = e => {
  e.preventDefault();
  e.stopPropagation();
  const { target: form } = e;
  const user = {
    "name": form.elements.name.value,
    "email": form.elements.email.value,
    "photo": imagePath
  };

  tableAddLine(user)
  addUser(user);
  const divMessage = document.querySelector('div.message');
  const elemntText = divMessage.querySelector('p');
  elemntText.innerHTML = 'Cadastro realizado com sucesso';
  divMessage.classList.remove('none');
  divMessage.querySelector('.btn-modal-close').onclick = () => divMessage.classList.add('none');
  setTimeout(() => divMessage.classList.add('none'), 5000);
  toggleResults();
  document.getElementById('img-profile').style.backgroundImage = '';
  document.getElementById('img-profile').style.borderStyle = 'dashed';
  form.reset();
};

function closeModal() {
  modal.querySelectorAll('.dinamic').forEach(element => element.remove());
  modal.close();
}

formRegister.addEventListener('submit', handleFormUser, true);
btnModal.addEventListener('click', e => modal.close());

function handleBtnsUsersEdit() {
  btnsEdit = document.querySelectorAll('button.edit');
  btnsEdit.forEach((btn, index) => {
    btn.addEventListener('click', e => {
      let users = JSON.parse(window.sessionStorage.getItem('users'));
      modal.classList.add('modal-open');
      modal.querySelectorAll('.dinamic').forEach(element => element.remove());
      modal.innerHTML += `
        <form action="" enctype="multipart/form-data" id="form-edit" class="dinamic">
            <input type="hidden" name="index" value="${index}" id="index-edit">
            <div>
              <label for="name-edit">Nome: </label>
              <input type="text" name="name" value="${users[index].name ?? 0}" id="name-edit">
            </div>
            <div>
              <label for="email-edit">Email: </label>
              <input type="email" name="email" value="${users[index].email}" id="email-edit">
            </div>
            <div>
              <label for="photo-edit">Foto</label>
              <input type="file" name="photo" id="photo-edit" accept="image/jpeg, image/png, image/gif, image/webp">
            </div>
            <button type="submit">Salvar</button>
          </form>
      `;
      let hadleCloseModal = e => closeModal();
      let btnClose = modal.querySelector('dialog button.btn-modal-close');
      btnClose.addEventListener('click', hadleCloseModal, true);
      let form = modal.querySelector('form');
      let tdIndex = form.elements.index.value;
      let user = users[tdIndex];
      const userEdit = {};
      const inputPhoto = document.getElementById('photo-edit');
      let imagePathEdit;

      inputPhoto.addEventListener('change', async () => {
        try {
          imagePathEdit = await sendImage(inputPhoto);
          userEdit.photo = imagePathEdit;
        } catch (error) {
          console.error(error);
        }
      });
      if (form)
        form.addEventListener('submit', e => {
          e.preventDefault();
          let users = JSON.parse(window.sessionStorage.getItem('users'));
            userEdit.name = form.elements.name.value;
            userEdit.email = form.elements.email.value;
            userEdit.photo = imagePathEdit !== undefined ? imagePathEdit : user.photo;
            users[index] = userEdit;
            window.sessionStorage.setItem('users', JSON.stringify(users));
            const tableRow = document.querySelector('.user-crud table tbody').rows[index];
            tableRow.querySelector('td:nth-child(1) div').style.backgroundImage = `URL(${userEdit.photo})`;
            tableRow.querySelector('td:nth-child(2)').textContent = userEdit.name;
            tableRow.querySelector('td:nth-child(3)').textContent = userEdit.email;
            closeModal();
        }, true);
      modal.show();
    });
  });
}
handleBtnsUsersEdit();

function handleBtnsUsersdelete() {
  btnsDelete = document.querySelectorAll('button.delete');
  btnsDelete.forEach((btn, index) => {
    btn.addEventListener('click', e => {
      modal.querySelectorAll('.dinamic').forEach(element => element.remove());
      modal.classList.add('modal-open');
      modal.innerHTML += `
      <p class="dinamic">Deseja realmente excluir este registro?</p>
      <div class="dinamic btns-modaloption">
        <button id="user-delete" class="btn-modaloption">Deletar</button>
        <button id="user-delete-cancel" class="btn-modaloption">Cancelar</button>
      </div>
      `;
      btnCanel = document.querySelector('button#user-delete-cancel');
      btnCanel.onclick = () => closeModal();
      let handleCloseModal = e => closeModal();
      let btnClose = modal.querySelector('dialog button.btn-modal-close');
      btnClose.addEventListener('click', handleCloseModal, true);
      btnDelete = document.querySelector('button#user-delete')
      btnDelete.addEventListener('click', () => {;
        const currentRow = btn.parentNode.parentNode;
        currentRow.classList.add('remove-table-row');
        let users = window.sessionStorage.getItem("users");
        if (users) {
          users = JSON.parse(users);
          const length = users.length - 1;
          users = users.filter(el => el !== users[index]);
          window.sessionStorage.setItem('users', JSON.stringify(users));
          if (length === 0) {
            window.sessionStorage.removeItem("users");
          }
          setTimeout(() => {
            currentRow.remove();
            toggleResults();
          }, 300);
          closeModal();
        }
      });
      modal.show();
    });
  });
}
