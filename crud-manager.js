window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crud-form');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const carsList = document.getElementById('cars-list');
    const refreshBtn = document.getElementById('refresh-list');
    
    const carIndexInput = document.getElementById('car-index');
    const titleInput = document.getElementById('car-title');
    const imgInput = document.getElementById('car-img');
    const descInput = document.getElementById('car-description');
    const linkInput = document.getElementById('car-link');
    
    let editingIndex = -1;
    
    // Initialize localStorage if empty
    function initializeStorage() {
        if (!localStorage.getItem('projectCards')) {
            localStorage.setItem('projectCards', JSON.stringify([]));
        }
    }
    
    // Get all cars from localStorage
    function getCars() {
        try {
            const data = localStorage.getItem('projectCards');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return [];
        }
    }
    
    // Save cars to localStorage
    function saveCars(cars) {
        try {
            localStorage.setItem('projectCards', JSON.stringify(cars));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Error saving data!');
            return false;
        }
    }
    
    // Render the list of cars
    function renderCarsList() {
        const cars = getCars();

        carsList.innerHTML = ""; // Clear safely

        if (cars.length === 0) {
            const emptyDiv = document.createElement("div");
            emptyDiv.className = "empty-state";

            const msg = document.createElement("p");
            msg.textContent = "No cars in storage. Add your first car above! 🚗";

            emptyDiv.appendChild(msg);
            carsList.appendChild(emptyDiv);
            return;
        }

        cars.forEach((car, index) => {
            const item = document.createElement("div");
            item.className = "car-item";

            // IMAGE (safe)
            const img = document.createElement("img");
            img.setAttribute("src", car.img);
            img.setAttribute("alt", car.title);
            img.onerror = () => {
                img.src = "https://via.placeholder.com/100x70?text=No+Image";
            };

            // INFO WRAPPER
            const info = document.createElement("div");
            info.className = "car-info";

            const title = document.createElement("h4");
            title.textContent = car.title;

            const shortDesc = document.createElement("p");
            shortDesc.textContent = 
                car.description.length > 100
                ? car.description.substring(0, 100) + "..."
                : car.description;

            info.appendChild(title);
            info.appendChild(shortDesc);

            // ACTIONS
            const actions = document.createElement("div");
            actions.className = "car-actions";

            const editBtn = document.createElement("button");
            editBtn.className = "btn-edit";
            editBtn.textContent = "Edit";
            editBtn.dataset.index = index;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-delete";
            deleteBtn.textContent = "Delete";
            deleteBtn.dataset.index = index;

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            // Build full item
            item.appendChild(img);
            item.appendChild(info);
            item.appendChild(actions);

            // Add to list
            carsList.appendChild(item);
        });

        // Add event listeners safely
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                editCar(index);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                deleteCar(index);
            });
        });
    }
    
    // CREATE: Add new car
    function createCar(carData) {
        const cars = getCars();
        cars.push(carData);
        if (saveCars(cars)) {
            alert('Car added successfully!');
            resetForm();
            renderCarsList();
        }
    }
    
    // UPDATE: Edit existing car
    function updateCar(index, carData) {
        const cars = getCars();
        if (index >= 0 && index < cars.length) {
            cars[index] = carData;
            if (saveCars(cars)) {
                alert('Car updated successfully!');
                resetForm();
                renderCarsList();
            }
        }
    }
    
    // DELETE: Remove car
    function deleteCar(index) {
        if (!confirm('Are you sure you want to delete this car?')) {
            return;
        }
        
        const cars = getCars();
        if (index >= 0 && index < cars.length) {
            cars.splice(index, 1);
            if (saveCars(cars)) {
                alert('Car deleted successfully! 🗑️');
                renderCarsList();
            }
        }
    }
    
    // Load car data into form for editing
    function editCar(index) {
        const cars = getCars();
        if (index >= 0 && index < cars.length) {
            const car = cars[index];
            
            editingIndex = index;
            carIndexInput.value = index;
            titleInput.value = car.title;
            imgInput.value = car.img;
            descInput.value = car.description;
            linkInput.value = car.link || '';
            
            formTitle.textContent = 'Edit Car';
            submitBtn.textContent = 'Update Car';
            cancelBtn.style.display = 'block';
            
            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Reset form to "Add" mode
    function resetForm() {
        form.reset();
        editingIndex = -1;
        carIndexInput.value = '';
        formTitle.textContent = 'Add New Car';
        submitBtn.textContent = 'Add Car';
        cancelBtn.style.display = 'none';
    }
    
    // Form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const carData = {
            title: titleInput.value.trim(),
            img: imgInput.value.trim(),
            description: descInput.value.trim(),
            link: linkInput.value.trim() || ''
        };
        
        if (editingIndex >= 0) {
            // UPDATE
            updateCar(editingIndex, carData);
        } else {
            // CREATE
            createCar(carData);
        }
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', resetForm);
    
    // Refresh button
    refreshBtn.addEventListener('click', renderCarsList);
    
    // Initialize
    initializeStorage();
    renderCarsList();
});