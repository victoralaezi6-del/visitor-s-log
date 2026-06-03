const landingView = document.getElementById('landing-view');
const signinView = document.getElementById('signin-view');
const signoutView = document.getElementById('signout-view');
const signinBtn = document.getElementById('signin-btn');
const signoutBtn = document.getElementById('signout-btn');
const backFromSigninBtn = document.getElementById('back-from-signin');
const backFromSignoutBtn = document.getElementById('back-from-signout');
const signinForm = document.getElementById('signin-form');
const signoutList = document.getElementById('signout-list');
const noVisitorsMsg = document.getElementById('no-visitors-msg');
const thankYouMessage = document.getElementById('thank-you-message');
        
let visitors = JSON.parse(localStorage.getItem('ndaVisitors')) || [];
        
function showView(viewToShow) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
            
    viewToShow.classList.add('active');
};
        
signinBtn.addEventListener('click', () => showView(signinView));
signoutBtn.addEventListener('click', () => {
showView(signoutView);
    updateSignoutList();
});
        
backFromSigninBtn.addEventListener('click', () => showView(landingView));
backFromSignoutBtn.addEventListener('click', () => showView(landingView));
        
signinForm.addEventListener('submit', function(e) {
    e.preventDefault();
            
    const name = document.getElementById('visitor-name').value;
    const reason = document.getElementById('visit-reason').value;
    const phone = document.getElementById('phone-number').value;
            
    const now = new Date();
    const visitor = {
        id: Date.now(),
        name: name,
        reason: reason,
        phone: phone,
        signInTime: now.toISOString(),
        signInDisplay: now.toLocaleString(),
        signOutTime: null,
        signOutDisplay: null
    };
            
    visitors.push(visitor);
            
    localStorage.setItem('ndaVisitors', JSON.stringify(visitors));
            
    signinForm.reset();
            
    showThankYouMessage();
});
        
function updateSignoutList() {
    signoutList.innerHTML = '';
            
    const activeVisitors = visitors.filter(visitor => !visitor.signOutTime);
            
    if (activeVisitors.length === 0) {
        signoutList.appendChild(noVisitorsMsg);
        noVisitorsMsg.style.display = 'block';
        return;
    }
            
    noVisitorsMsg.style.display = 'none';
            
    activeVisitors.forEach(visitor => {
        const visitorItem = document.createElement('div');
        visitorItem.className = 'visitor-item';
        visitorItem.dataset.id = visitor.id;
                
        visitorItem.innerHTML = `
            <div class="visitor-info">
                <h3>${visitor.name}</h3>
                <p><strong>Reason:</strong> ${visitor.reason} | <strong>Phone:</strong> ${visitor.phone}</p>
                <p><strong>Signed In:</strong> ${visitor.signInDisplay}</p>
            </div>
            <button class="signout-action-btn" data-id="${visitor.id}">
                Sign Out <i class="fas fa-sign-out-alt"></i>
            </button>
        `;
                
        signoutList.appendChild(visitorItem);
    });
            
    document.querySelectorAll('.signout-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const visitorId = parseInt(this.dataset.id);
            signOutVisitor(visitorId);
        });
    });
}
        
function signOutVisitor(visitorId) {
    const visitorIndex = visitors.findIndex(v => v.id === visitorId);
            
    if (visitorIndex !== -1) {
        const now = new Date();
        visitors[visitorIndex].signOutTime = now.toISOString();
        visitors[visitorIndex].signOutDisplay = now.toLocaleString();
                
        localStorage.setItem('ndaVisitors', JSON.stringify(visitors));
                
        showThankYouMessage();
    }
}
        
function showThankYouMessage() {
    thankYouMessage.style.display = 'block';
            
    setTimeout(() => {
        thankYouMessage.style.display = 'none';
        showView(landingView);
    }, 3000);
}
        
function exportToCSV() {
    if (visitors.length === 0) {
        alert('No visitor data to export.');
        return;
    }
            
    let csv = 'ID,Name,Reason,Phone,Sign In Time,Sign Out Time\n';
            
    visitors.forEach(visitor => {
        csv += `${visitor.id},"${visitor.name}","${visitor.reason}","${visitor.phone}","${visitor.signInDisplay}","${visitor.signOutDisplay || 'Not signed out'}"\n`;
    });
            
    const blob = new Blob([csv], { type: 'text/csv' });
            
    const url = URL.createObjectURL(blob);
            
    const a = document.createElement('a');
    a.href = url;
    a.download = `nda_visitors_${new Date().toISOString().split('T')[0]}.csv`;
            
    document.body.appendChild(a);
    a.click();
            
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
        
        
const exportButton = document.createElement('button');
exportButton.className = 'action-button';
exportButton.innerHTML = '<span>EXPORT DETAILS <i class="fas fa-download"></i></span>';
exportButton.style.backgroundColor = 'var(--airforce_blue)';
exportButton.style.color = 'var(--airforce_white)';
exportButton.addEventListener('click', exportToCSV);
exportButton.addEventListener('mouseenter', function() {
    this.style.backgroundColor = '#c19b2a';
});
exportButton.addEventListener('mouseleave', function() {
    this.style.backgroundColor = 'var(--airforce_blue)';
});
        
       
landingView.querySelector('.button-container').appendChild(exportButton);
        
        
updateSignoutList();
        
console.log('NDA Hall of Fame Visitor Log System initialized.');
console.log(`Currently ${visitors.filter(v => !v.signOutTime).length} active visitors.`);