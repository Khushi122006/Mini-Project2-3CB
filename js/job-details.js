
// Run code after the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Get job ID from the URL
    let params = new URLSearchParams(window.location.search);
    let id = Number(params.get("id"));

    // Get all jobs
    let jobs = jobaddaGetItems();

    // Find the job with the matching ID
    let item = null;

    for (let i = 0; i < jobs.length; i++) {
        if (Number(jobs[i].id) === id) {
            item = jobs[i];
            break;
        }
    }

    // Get the HTML element where job details will appear
    let root = document.getElementById("opportunityDetail");

    // Check if job exists
    if (item === null) {

        root.innerHTML = `
            <h3>Opportunity not found</h3>
            <p>This listing may have been removed.</p>
            <a href="jobs.html">Browse jobs</a>
        `;

        return;
    }

    // Check whether job is already saved
    let savedJobs = jobaddaGetSaved();
    let isSaved = savedJobs.includes(id);

    // Display job details
    root.innerHTML = `
        <section class="panel">

            <h1>${jobaddaEscape(item.title)}</h1>

            <h3>${jobaddaEscape(item.company)}</h3>

            <p>Category: ${jobaddaEscape(item.category)}</p>

            <p>Location: ${jobaddaEscape(item.location)}</p>

            <p>Mode: ${jobaddaEscape(item.mode)}</p>

            <p>Type: ${jobaddaEscape(item.type)}</p>

            <h2>About this opportunity</h2>

            <p>${jobaddaEscape(item.description)}</p>

            <h2>Skills</h2>

            ${(item.skills || []).map(function(skill) {
                return `<span class="tag">${jobaddaEscape(skill)}</span>`;
            }).join(" ")}

        </section>

        <aside class="panel">

            <h2>${jobaddaEscape(item.salary || "Not specified")}</h2>

            <p>Company: ${jobaddaEscape(item.company)}</p>

            <button id="applyDemo">Apply interest</button>

            <button id="saveDetail">
                ${isSaved ? "Remove saved" : "Save opportunity"}
            </button>

            <p id="detailNotice"></p>

        </aside>
    `;


    // SAVE AND REMOVE JOB
    document.getElementById("saveDetail").addEventListener("click", function () {

        let savedJobs = jobaddaGetSaved();

        if (savedJobs.includes(id)) {

            // Remove job from saved list
            savedJobs = savedJobs.filter(function(jobId) {
                return jobId !== id;
            });

        } else {

            // Add job to saved list
            savedJobs.push(id);

        }

        // Update saved jobs
        jobaddaSaveSaved(savedJobs);

        // Change button text
        if (savedJobs.includes(id)) {
            document.getElementById("saveDetail").textContent = "Remove saved";
            jobaddaToast("Opportunity saved");
        } else {
            document.getElementById("saveDetail").textContent = "Save opportunity";
            jobaddaToast("Removed from saved");
        }

    });


    // APPLY FOR JOB
    document.getElementById("applyDemo").addEventListener("click", function () {

        // Check whether user is logged in
        let user = JSON.parse(
            localStorage.getItem("jobaddaCurrentUser") || "null"
        );

        let notice = document.getElementById("detailNotice");

        if (user !== null) {

            notice.textContent = "Your interest has been recorded.";

        } else {

            notice.textContent = "Please login or register first.";

            // Redirect to login page
            setTimeout(function() {
                window.location.href = "login.html";
            }, 1300);

        }

    });

});
