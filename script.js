document.addEventListener('DOMContentLoaded', function() {
    let data = JSON.parse(localStorage.getItem('candidates')) || [];

    const facilityTables = {
        'Asheville': document.querySelector('#asheville-table tbody'),
        'Raleigh': document.querySelector('#raleigh-table tbody'),
        'Greeneville': document.querySelector('#greeneville-table tbody')
    };

    function saveToLocalStorage() {
        localStorage.setItem('candidates', JSON.stringify(data));
    }

    function populateTable() {
        Object.values(facilityTables).forEach(tbody => tbody.innerHTML = '');

        data.forEach((candidate, index) => {
            const row = document.createElement('tr');
            Object.values(candidate).forEach((text, i) => {
                const cell = document.createElement('td');
                cell.textContent = text;
                if (i === 4 && text === 'N/A') {
                    cell.textContent = '';
                }
                row.appendChild(cell);
            });

            // Add Delete Button
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                data.splice(index, 1);
                saveToLocalStorage();
                populateTable();
                updateCharts();
            };
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            facilityTables[candidate.Facility].appendChild(row);
        });
    }

    document.getElementById('candidate-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const form = event.target;

        const newCandidate = {
            Candidate: form['candidate-name'].value,
            Facility: form['facility'].value,
            DrugTest: form['drug-test'].value,
            DrugTestPassed: form['drug-test-passed'].value,
            DrugTestExpiration: form['drug-test-expiration'].value || 'N/A',
            BackgroundCheck: form['background-check'].value,
            BackgroundCheckPassed: form['background-check-passed'].value,
        };

        data.push(newCandidate);
        saveToLocalStorage();
        populateTable();
        updateCharts();
        form.reset();
    });

    populateTable();
    updateCharts();
});

