
// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    var score;
    async function getScore(jobDescription){
        var resumeText = `
        Mohsan Yaseen
        • +923445162050 • mohsanyaseen.dev@gmail.com • Lahore, Pakistan • Open to Remote • Open to Relocate
        • LinkedIn • GitHub
        SUMMARY
        Experienced Python/ Backend Developer with a passion for crafting innovative solutions. Adept at turning complex
        challenges into elegant, efficient code. Specialized in automation, data extraction, and API development. Proven track record 
        in seamlessly integrating diverse technologies to drive project success. Committed to delivering high-quality software 
        solutions and eager to contribute to cutting-edge projects in a dynamic work environment.
        SKILLS
        Programming Languages Python (Programming Language), JavaScript (Programming Language)
        Web Development Frameworks Flask (Web Framework), Django (Web Framework), React.js, FastAPI
        Database Management PostgreSQL, MySQL, MongoDB, Redis
        Tools Git, Postman, Selenium
        Cloud Services and Development AWS, Ubuntu (Operating System), Nginx, Gunicorn
        Interests Computer Vision, Machine Learning
        EXPERIENCE
        Python Developer
        HR Matrix
        As a Python Developer at HRMatrix, a project-based company located in the USA, I specialize in integrating AI models 
        and building Restful APIs. My role revolves around seamlessly integrating Django frameworks with AI models to develop 
        robust and efficient APIs. This involves ensuring the smooth communication between AI functionalities and the APIs, 
        contributing to the overall project success.
        • Spearheaded the development of AI Survey Bot, enhancing HRMatrix's software suite and providing advanced survey 
        capabilities to clients.
        • Seamlessly integrated AI functionalities such as Resume Parsing and Interview Bot into existing HRMatrix software, 
        optimizing workflows and improving user experience.
        • Contributed to the enhancement of HRMatrix's product offerings by developing AI solutions like AI Interview Bot and AI 
        Survey Bot, aligning with the company's focus on innovative HR technology.
        • Played a pivotal role in the implementation of AI Face Attendance feature within HRMatrix's software, leveraging
        Python development skills to ensure accuracy and efficiency in attendance management.
        Python Developer
        Aug '23 — Jan '24
        TecSpine
        As a Python Developer at TecSpine, I play a pivotal role in developing and maintaining various software components. My 
        core responsibilities encompass Web Scraping, API Development, Backend Development, Database Design, Collaboration, 
        and testing.
        • Spearheaded key initiatives to enhance data retrieval efficiency, automate email data integration into Monday.com, and 
        implement robust solutions for data extraction from eBay.
        • Leveraged diverse technologies including pandas, Django, PostgreSQL, Redis, Flask, Beautiful Soup, and JSON to 
        optimize processes and ensure data consistency.
        • Engineered backend APIs resulting in an 90% reduction in lengthy data processing times by transforming US listing data 
        from CSV files into a streamlined database, utilizing Django, PostgreSQL, JSON, and Redis.
        Oracle Developer Intern
        Jun '22 — Aug’22
        PMS Pvt. Ltd.
         Two-month internship at PMS (Pvt.) Ltd., specializing in Oracle Database design development using Oracle 6i and 10g 
        tools. Contributed to the WAPDA Project by designing and implementing databases, forms, and reports for multiple 
        modules.
        EDUCATION
        Sep — Jun '23 BS Software Engineering in Software Engineering, The University of Lahore (UOL) (GPA: 3.04)
        Lahore, Pakistan
        PROJECTS
        AI-Based Image to Caption Generating
        Apr '24 Present
        • Leveraging state-of-the-art techniques including semantic segmentation, and natural language processing with models 
        like GPT, to automatically generate descriptive captions for images.
        AI-Based Surveillance System FYP, The university of Lahore Link
        Jan '23 — May '23
        • Developed a cutting-edge web application utilizing deep learning and computer vision technologies to enable real-time 
        tracking and re-identification of individuals in videos and live camera feeds.
        • Technologies: Python, Machine Learning, Computer Vision, HTML, CSS, JavaScript | Implemented Machine Learning 
        (OpenCV & TensorFlow) for object detection and re identification
        AWARDS
        1st National AI Championship
        Aug '23
        Issuer: LUMS University, FAST University, Soliton Technologies, and the Artificial Intelligence Education Foundation
        Selected as one of the top 30 AI projects out of 200 at the AI Championship organized by LUMS University, FAST
        University, Soliton Technologies, and the Artificial Intelligence Education Foundation. Awarded a certificate for outstanding
        participation and performance in the competition.
        AI Applications Competition
        Oct '01
        Issuer: WowDAO
        Participated in the Global AI Hackathon organized by WowDAO. Showcased skills, learned, and networked within a 
        dynamic and diverse environment. Grateful for the opportunity and eagerly anticipating future events for continued 
        growth and collaboration.
        Final Year Project funding
        Jan '23
        Issuer: Ignite National Technology Fund
        I am proud to announce that my project has been selected for funding amounting to Rs 88,000 through the Ignite 
        program, standing out amongst 25,000 applicants. Being one of the 2,000 projects chosen, my work has been recognized 
        for its innovation and potential impact, distinguishing it from a highly competitive pool of projects. This acknowledgment 
        highlights not only the merit of my project but also its promise to make a meaningful contribution within its respective 
        field.
        `
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer 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");
        myHeaders.append("Cookie", "__cf_bm=hMpoxpQZRpwJxKbsYTbjDH4R4XAmpBVErY2NYVRNw4M-1714146313-1.0.1.1-7Uq_XV1BGIaBKfTs8x_lGzhpoXumb077Q4q2D_G1Vrgbg0FdEy11_lZ4AXQdYAglYgYvUovAnLUhcmc9TcpWlw; _cfuvid=79jBgx6T9N2TwcLpPY3Ui2RITdG9eJGMUSt3hmVXFio-1714146313469-0.0.1.1-604800000");

        const raw = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
            {
            "role": "system",
            "content": "You are a helpful assistant."
            },
            {
            "role": "user",
            "content": `I have JD and a resume provide a single score 0 to 100 that how much my resume match to the Job requirements. Output will be only JSON format: { "score": 0 }
            JD: ${jobDescription}
            Resume: ${resumeText}
            `
            },
        ]
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        var gptresponse;
        const res = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        gptresponse = await res.json();
        console.log(gptresponse);
        var _score = gptresponse.choices[0].message.content;
        console.log(_score);
        // check if score is json or not
        if(_score.includes("```json") === true){
            console.log("not json");
            // remove ```json from score
            _score = _score.replace("```json", "");
            _score = _score.replace("```", "");
            // load to json
        }
        _score = JSON.parse(_score);
        score = _score.score;
        return score;
    }
    
    if (message.action === 'scrapeJob') {
        const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title').innerText;
        const spans = document.querySelectorAll('.jobs-description-content__text span');
        const spanTexts = Array.from(spans, span => span.innerText.trim()).join('\n');
        // const score = await getScore(spanTexts);
        // console.log(score);
        
        sendResponse({title: jobTitle, description: spanTexts});
        }
    });
  