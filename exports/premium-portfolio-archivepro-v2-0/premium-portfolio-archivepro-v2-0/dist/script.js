document.addEventListener('DOMContentLoaded', function() {
    
    function filterProjects(category) {
        const projectCards = document.querySelectorAll('.project-card');
        const projectsGrid = document.getElementById('projectsGrid');
        
        projectCards.forEach(card => {
            card.style.display = 'none';
            card.style.animation = '';
        });
        
        const visibleCards = [];
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                visibleCards.push(card);
            }
        });
        
        visibleCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
            }, index * 100);
        });
        
        updatePagination(visibleCards.length);
    }
    
    function updatePagination(totalProjects = 24) {
        const pageButtons = document.querySelectorAll('.page-btn');
        const prevButton = document.querySelector('.prev-btn');
        const nextButton = document.querySelector('.next-btn');
        const projectsPerPage = 6;
        const totalPages = Math.ceil(totalProjects / projectsPerPage);
        
        pageButtons.forEach((btn, index) => {
            if (index < totalPages) {
                btn.style.display = 'inline-block';
            } else {
                btn.style.display = 'none';
            }
        });
        
        if (currentPage > totalPages) {
            currentPage = totalPages || 1;
        }
        
        pageButtons.forEach(btn => btn.classList.remove('active'));
        
        if (pageButtons[currentPage - 1]) {
            pageButtons[currentPage - 1].classList.add('active');
        }
        
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages || totalPages === 0;
        
        const paginationInfo = document.querySelector('.pagination-info');
        const start = totalProjects === 0 ? 0 : (currentPage - 1) * projectsPerPage + 1;
        const end = Math.min(currentPage * projectsPerPage, totalProjects);
        paginationInfo.innerHTML = `Showing <strong>${start}-${end}</strong> of <strong>${totalProjects}</strong> projects`;
    }

    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const dropdown = select.querySelector('.select-dropdown');
        const options = select.querySelectorAll('.select-option');
        const valueElement = select.querySelector('.select-value');
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            customSelects.forEach(otherSelect => {
                if (otherSelect !== select) {
                    otherSelect.classList.remove('active');
                }
            });
            
            // Toggle current select
            select.classList.toggle('active');
        });
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                valueElement.textContent = this.textContent;
                
                select.classList.remove('active');
                
                if (select.classList.contains('filter-select')) {
                    filterProjects(this.dataset.value);
                } else if (select.classList.contains('sort-select')) {
                    sortProjects(this.dataset.value);
                }
            });
        });
    });
    
    document.addEventListener('click', function() {
        customSelects.forEach(select => {
            select.classList.remove('active');
        });
    });
    
    const viewButtons = document.querySelectorAll('.view-btn');
    const projectsGrid = document.getElementById('projectsGrid');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            if (view === 'list') {
                projectsGrid.style.gridTemplateColumns = '1fr';
                projectsGrid.style.gap = '15px';
            } else {
                projectsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
                projectsGrid.style.gap = '30px';
            }
        });
    });
    
    function sortProjects(sortBy) {
        const projectsContainer = document.getElementById('projectsGrid');
        const projects = Array.from(projectsContainer.children);
        
        const visibleProjects = projects.filter(project => 
            project.style.display !== 'none'
        );
        
        visibleProjects.sort((a, b) => {
            const aTitle = a.querySelector('h3').textContent;
            const bTitle = b.querySelector('h3').textContent;
            
            switch (sortBy) {
                case 'alphabetical':
                    return aTitle.localeCompare(bTitle);
                case 'newest':
                    return 0;
                case 'oldest':
                    return 0;
                case 'popular':
                    return 0;
                default:
                    return 0;
            }
        });
        
        visibleProjects.forEach(project => {
            projectsContainer.appendChild(project);
        });
    }
    
    // Pagination Functionality
    const pageButtons = document.querySelectorAll('.page-btn');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    let currentPage = 1;
    
    pageButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            currentPage = index + 1;
            updatePagination();
            
            document.querySelector('.projects-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
    
    nextButton.addEventListener('click', function() {
        const visibleProjects = document.querySelectorAll('.project-card[style*="display: block"]').length;
        const totalPages = Math.ceil(visibleProjects / 6);
        
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination(visibleProjects);
        }
    });
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
    
    updatePagination();
});