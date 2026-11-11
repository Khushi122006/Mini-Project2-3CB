
document.addEventListener('DOMContentLoaded', function () {

    // Check whether the page is Jobs or Internships
    let isInternship = location.pathname.endsWith('internships.html');

    let category = 'job';

    if (isInternship) {
        category = 'internship';
    }

    // Get HTML elements
    let search = document.getElementById('searchInput');
    let locationFilter = document.getElementById('locationFilter');
    let modeFilter = document.getElementById('modeFilter');

    let results = document.getElementById('listingResults');
    let count = document.getElementById('resultCount');
    let empty = document.getElementById('emptyResults');

    // Get search value from URL
    let params = new URLSearchParams(location.search);

    search.value = params.get('q') || '';

    // Function to show jobs or internships
    function showResults() {

        let searchText = search.value.toLowerCase().trim();

        // Get all jobs and filter them
        let filteredItems = jobaddaGetItems().filter(function (item) {

            // Check category
            if (item.category !== category) {
                return false;
            }

            // Check search text
            let itemDetails = item.title + ' ' + item.company + ' ' + item.location + ' ' + (item.skills || []).join(' ');

            if (!itemDetails.toLowerCase().includes(searchText)) {
                return false;
            }

            // Check location
            if (locationFilter.value !== '' && item.location !== locationFilter.value) {
                return false;
            }

            // Check work mode
            if (modeFilter.value !== '' && item.mode !== modeFilter.value) {
                return false;
            }

            return true;
        });

        // Display filtered results
        results.innerHTML = filteredItems.map(jobaddaCard).join('');

        // Display total results
        count.textContent = filteredItems.length + ' results found';

        // Show message if no results are available
        if (filteredItems.length === 0) {
            empty.hidden = false;
        } else {
            empty.hidden = true;
        }
    }

    // Run search when form is submitted
    document.getElementById('listingFilters').addEventListener('submit', function (event) {
        event.preventDefault();
        showResults();
    });

    // Update results when filters change
    search.addEventListener('input', showResults);
    locationFilter.addEventListener('input', showResults);
    modeFilter.addEventListener('input', showResults);

    // Clear all filters
    document.getElementById('clearFilters').addEventListener('click', function () {

        search.value = '';
        locationFilter.value = '';
        modeFilter.value = '';

        showResults();
    });

    // Show results when page opens
    showResults();

});
