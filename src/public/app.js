document.addEventListener('DOMContentLoaded', function() {
    const instances = M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
});

document.addEventListener('DOMContentLoaded', function() {
    const instances = M.Modal.init(document.querySelectorAll('.modal'), {});
});

document.querySelectorAll(".stack-trace-logs").forEach(element => {
    element.onclick = function (){
        console.log("clicked")
        let trace = JSON.parse(this.dataset.trace);
        axios.post("/logs", { stacktrace: trace, type:"error" })
            .then(response => document.getElementById("log-modal-body").innerHTML = response.data )
            .catch(error => console.log(error));
    }
})

document.querySelectorAll(".show-logs").forEach(element => {
    element.onclick = function (){
        console.log("clicked")
        let queue = this.dataset.queue;
        let jobId = this.dataset.jobid;
        axios.post("/logs", { queue: queue, job: jobId, type:"logs" })
            .then(response => document.getElementById("log-modal-body").innerHTML = response.data )
            .catch(error => console.log(error));
    }
})

