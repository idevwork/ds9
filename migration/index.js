let k = console.log.bind(console)
var sander = require('sander')
var fs = require('fs')
var j_ = require('./j_.js')
var signItData = require('./signItData.json')

var cloneObj = function(obj) {
    return JSON.parse(JSON.stringify(obj))
}

var readFile = function(file, cb) {
    sander
        .readFile(file, {
            encoding: 'utf-8',
        })
        .then(function(fileContents) {
            // console.log(fileContents)
            cb(fileContents)
        })
}

var writeFile = function(pathAndFile, contents, cb) {
    sander.writeFile(pathAndFile, contents).then(function() {
        console.log('wrote to ' + pathAndFile)
        cb()
    })
}

let unitProductIDsMap = {
    '0': 138345,
    '1': 137222,
    '2': 137279,
    '3': 145363,
}

let unitProductSKUMap = {
    0: 'azst_signitasl-574',
    1: 'azst_signitasl-575',
    2: 'azst_signitasl-576',
    3: 'azst_signitasl-963',
}

let coverImageRemotePath = `http://vault.platformpurple.com/static/productfiles`

let courseNavData = {
    id: 'c_1556647720888_A6zpoUyY_woodchuck',
    component: 'courseNav',
    componentPath: 'common/courseRabbit/courseNav',
}

let courseFooterData = {
    id: 'c_1556647720888_MybzVR5M_woodswallow',
    component: 'courseFooter',
    componentPath: 'common/courseRabbit/courseFooter',
    courseRoutes: ['scores', 'dictionary'],
}

let courseMenuData = {
    id: 'l_1556647720892_JPGt4QfO_cloudedleopard',
    component: 'Menu',
    componentPath: 'common/courseRabbit/Menu',
    children: [],
}

let courseVideoData = {
    id: 'c_1556647720888_ekWDTWSN_potbelliedpig',
    fileName: 'Unit2-Lesson10-1-Chapter1-AnimalsVocabularySigns.mp4',
    component: 'CourseVideo',
    componentPath: 'common/courseRabbit/CourseVideo',
    videoLayout: 'SignItVideoLayout',
    videoLayoutPath: 'customComponents/signitasl/SignItVideoLayout',
    children: [],
}

let courseQuizData = {
    id: 'c_1556647720890_BxbjYTl3_limpet',
    component: 'Quiz',
    componentPath: 'common/courseRabbit/QuizBoss',
    children: [],
}

let unitObj = {
    title: 'Sample Chapters',
    subTitle: 'Unit 0',
    coverImage: 'unit1-poster.jpg',
    type: 'unit',
    components: [],
}

let videoChapterObj = {
    title: 'Vocabulary',
    subTitle: 'Chapter 1',
    icon: 'fa-play-circle',
    components: [],
}

let quizChapterObj = {
    title: 'QUIZ: Animal Signs',
    subTitle: 'Chapter 1',
    icon: 'fa-question',
    components: [],
}

let quizTextQuestionObj = {
    component: 'QuizText',
    componentPath: 'common/courseRabbit/QuizText',
    quizQuestionText: "What's this sign?",
    quizAnswers: [],
}

let quizImageQuestionObj = {
    component: 'QuizImage',
    componentPath: 'common/courseRabbit/QuizImage',
    quizQuestionText: "What's this sign?",
    quizAnswers: [],
}

let quizVideoQuestionObj = {
    component: 'QuizVideo',
    componentPath: 'common/courseRabbit/QuizVideo',
    videoLayout: 'SignItQuizVideoLayout',
    videoLayoutPath: 'customComponents/signitasl/SignItQuizVideoLayout',
    quizQuestionText: 'In the video, Chef Keith explains that...',
    fileName: '/NewDictionary/2-10/animal.mp4',
    quizAnswers: [],
}

let courseObj = {
    global: {
        defaultBackgroundColor: '#eee',
        defaultToolbarColor: '#EDBD2B',
    },
    content: [],
    media: {
        video: [],
        subtitleFiles: {},
    },
}

let videoMediaObj = {
    chapterStartSeconds: 0,
    displayName: '',
    fileName: '',
    remotePath: '',
}

let subtitleFileObj = {
    label: '',
    lang: '',
    remotePath: '',
}

let courses = []
let courseIndex = 0

signItData.forEach((unit, unitIndex) => {
    let productTitle = `Sign It: ${unit.unitName}`
    let productID = unitProductIDsMap[courseIndex]
    let productSKU = unitProductSKUMap[courseIndex]

    let newUnitObj = cloneObj(unitObj)
    newUnitObj.title = unit.unitName
    newUnitObj.subTitle = 'Unit ' + String(unit.unitNumber)
    newUnitObj.coverImage = `${coverImageRemotePath}/${productSKU}/media/${unit.coverImage}`
    newUnitObj.order = unitIndex
    newUnitObj.courseStart = true

    let unitCourse = cloneObj(courseObj)

    // will not be in final obj
    // unitCourse.productTitle = productTitle
    // unitCourse.productID = productID
    // unitCourse.productSKU = productSKU
    // unitCourse.title = productTitle
    // unitCourse.subTitle = 'Unit ' + String(unit.unitNumber)

    // unitCourse.content.children = newUnitObj.children;
    unitCourse.global.nextCourseProductID = unitProductIDsMap[courseIndex + 1] ? unitProductIDsMap[courseIndex + 1] : false

    // add components to unit
    let newCourseMenuObjForUnit = cloneObj(courseMenuData)

    unit.unitContent.forEach((lesson, lessonIndex) => {
        let newLessonObj = cloneObj(unitObj)
        newLessonObj.title = lesson.lessonName
        newLessonObj.subTitle = 'Lesson ' + String(lesson.lessonDisplayNumber)
        newLessonObj.coverImage = `${coverImageRemotePath}/${productSKU}/media/${lesson.coverImage}`
        newLessonObj.order = lessonIndex

        // Sets lesson id, type and parent obj
        newLessonObj.id = j_.uaid('l')
        newLessonObj.type = 'lesson'
        // newLessonObj.parent = unitCourse.productID;

        // start add components for lesson ~~~
        let newCourseMenuObjForLesson = cloneObj(courseMenuData)

        let chapterNumber = 1
        lesson.lessonContent.forEach((chapter, index) => {
            // sets the chapter type and parent obj
            let newChapterObj

            // start components to chapter
            let newCourseMenuObjForChapter

            switch (chapter.type) {
                case 'movie':
                    newCourseMenuObjForChapter = cloneObj(courseVideoData)

                    var fullFileName = chapter.filename.replace('/quiz-videos', 'quiz-videos')
                    var cleanFileName = j_.lastItemOf(fullFileName, '/')

                    newChapterObj = cloneObj(videoChapterObj)
                    newChapterObj.title = chapter.title
                    newChapterObj.subTitle = `Chapter ${chapterNumber}`
                    // newChapterObj.fileName = cleanFileName;
                    newCourseMenuObjForChapter.fileName = cleanFileName
                    newChapterObj.id = j_.uaid('c')

                    let videoObj = cloneObj(videoMediaObj)
                    videoObj.displayName = chapter.title
                    videoObj.fileName = cleanFileName
                    videoObj.remotePath = `/azst_signitasl-575/media/${fullFileName}`

                    // sets the video id, parent and type
                    videoObj.id = j_.uaid('v')
                    videoObj.parent = newChapterObj.id
                    videoObj.type = 'videoMedia'

                    let subtitleObj = cloneObj(subtitleFileObj)
                    subtitleObj.label = 'English'
                    subtitleObj.lang = 'en'
                    subtitleObj.remotePath = `/azst_signitasl-575/vtt/${fullFileName.replace('.mp4', '.vtt')}`

                    // sets the subtitle id, parent and type
                    subtitleFileObj.id = j_.uaid('s')
                    subtitleFileObj.parent = videoObj.id
                    subtitleFileObj.type = 'subtitleFile'

                    if (!unitCourse.media.video.find(item => item.fileName === videoObj.fileName)) {
                        unitCourse.media.video.push(videoObj)
                    }
                    unitCourse.media.subtitleFiles[cleanFileName] = []
                    unitCourse.media.subtitleFiles[cleanFileName].push(subtitleObj)

                    break
                case 'quiz':
                    newCourseMenuObjForChapter = cloneObj(courseQuizData)

                    newChapterObj = cloneObj(quizChapterObj)
                    newChapterObj.title = chapter.title
                    newChapterObj.subTitle = `Chapter ${chapterNumber}`

                    newChapterObj.id = j_.uaid('q')

                    let newQuestionObj = {}
                    chapter.questions.forEach((question, questionIndex) => {
                        switch (question.type) {
                            case 'quizMultipleChoice':
                                newQuestionObj = cloneObj(quizTextQuestionObj)
                                newQuestionObj.id = j_.uaid('q')
                                newQuestionObj.quizQuestionText = question.quizQuestionText
                                // newQuestionObj.notForLessonExam = question.notForLessonExam;
                                newQuestionObj.quizAnswers = question.quizAnswers.map(answer => {
                                    answer.id = j_.uaid('q')
                                    return answer
                                })

                                break
                            case 'quizVideo':
                                newQuestionObj = cloneObj(quizVideoQuestionObj)
                                newQuestionObj.id = j_.uaid('q')
                                newQuestionObj.quizQuestionText = question.quizQuestionText
                                // newQuestionObj.notForLessonExam = question.notForLessonExam;
                                newQuestionObj.quizAnswers = question.quizAnswers.map(answer => {
                                    answer.id = j_.uaid('q')
                                    return answer
                                })

                                var fullFileName = question.filename
                                if (fullFileName.charAt(0) === '/') {
                                    fullFileName = fullFileName.slice(1)
                                }
                                var cleanFileName = j_.lastItemOf(fullFileName, '/')

                                newQuestionObj.fileName = cleanFileName

                                let videoObj = cloneObj(videoMediaObj)
                                videoObj.displayName = chapter.title
                                videoObj.fileName = cleanFileName
                                videoObj.remotePath = `/azst_signitasl-575/media/${fullFileName}`

                                if (!unitCourse.media.video.find(item => item.fileName === videoObj.fileName)) {
                                    unitCourse.media.video.push(videoObj)
                                }

                                break
                            case 'quizImage':
                                newQuestionObj = cloneObj(quizImageQuestionObj)
                                newQuestionObj.id = j_.uaid('q')
                                newQuestionObj.quizQuestionText = question.quizQuestionText
                                newQuestionObj.quizAnswers = question.quizAnswers.map(answer => {
                                    answer.id = j_.uaid('q')
                                    answer.remotePath = `/productfiles/azst_signitasl-575/media`
                                    answer.fileName = answer.filename
                                    delete answer.filename
                                    
                                    return answer
                                })

                                break
                            default:
                                k('question type does not match: ', chapter)
                        }

                        // sets question type and parent
                        newQuestionObj.type = 'question'
                        newQuestionObj.parent = newChapterObj.id
                        newQuestionObj.order = questionIndex
                        newQuestionObj.notForLessonExam = question.notForLessonExam

                        unitCourse.content.push(newQuestionObj)

                        // newChapterObj.children.push(newQuestionObj.id);
                        newCourseMenuObjForChapter.children.push(newQuestionObj.id)
                    })

                    break

                case 'exam':
                    k('EXAM!')

                    newCourseMenuObjForChapter = cloneObj(courseQuizData)

                    newChapterObj = cloneObj(quizChapterObj)
                    newChapterObj.title = chapter.title
                    newChapterObj.subTitle = `Chapter ${chapterNumber}`
                    newChapterObj.id = j_.uaid('e')

                    break
                default:
                    k('chapter type does not match: ', chapter)
            }

            newChapterObj.parent = newLessonObj.id
            newChapterObj.type = chapter.type
            newChapterObj.order = index

            // complete components to chapter
            // newCourseMenuObjForChapter.children.push(newLessonObj.id);

            courseNavData.id = j_.uaid('c')
            courseNavData.parent = newChapterObj.id
            newChapterObj.components.push(cloneObj(courseNavData))

            newCourseMenuObjForChapter.id = j_.uaid('c')
            newCourseMenuObjForChapter.parent = newChapterObj.id
            newChapterObj.components.push(newCourseMenuObjForChapter)

            courseFooterData.id = j_.uaid('c')
            courseFooterData.parent = newChapterObj.id
            newChapterObj.components.push(cloneObj(courseFooterData))

            newCourseMenuObjForLesson.children.push(newChapterObj.id)

            // add chapter data to content array
            unitCourse.content.push(newChapterObj)

            chapterNumber++
        })

        // complete add components for lesson
        newLessonObj.components.push(cloneObj(courseNavData))

        newCourseMenuObjForLesson.parent = newLessonObj.id
        newCourseMenuObjForLesson.id = j_.uaid('l')
        newLessonObj.components.push(newCourseMenuObjForLesson)
        newLessonObj.components.push(cloneObj(courseFooterData))

        newCourseMenuObjForUnit.children.push(newLessonObj.id)
        newCourseMenuObjForUnit.id = j_.uaid('c')

        // add lesson data to content array
        unitCourse.content.push(newLessonObj)
    })

    newUnitObj.components.push(cloneObj(courseNavData))
    newUnitObj.components.push(newCourseMenuObjForUnit)
    newUnitObj.components.push(cloneObj(courseFooterData))

    // add unit data to content array
    unitCourse.content.push(newUnitObj)

    // k("courseObj: ", courseObj);
    // courseObj.content.children.push(newUnitObj);

    //push special routes into flat array structure
    unitCourse.content.push({
        title: 'My Scores',
        icon: 'fa-clipboard',
        id: 'scores',
        components: [
            {
                component: 'courseNav',
                componentPath: 'common/courseRabbit/courseNav',
            },
            {
                otherCourses: [138345, 137222, 137279, 145363],
                component: 'CourseScores',
                componentPath: 'common/courseRabbit/CourseScores',
            },
            {
                component: 'courseFooter',
                componentPath: 'common/courseRabbit/courseFooter',
                courseRoutes: ['scores', 'dictionary'],
            },
        ],
    })

    unitCourse.content.push({
        title: 'Dictionary',
        icon: 'fa-book',
        id: 'dictionary',
        components: [
            {
                component: 'courseNav',
                componentPath: 'common/courseRabbit/courseNav',
            },
            {
                component: 'CourseDictionary',
                componentPath: 'customComponents/signitasl/CourseDictionary',
            },
            {
                component: 'courseFooter',
                componentPath: 'common/courseRabbit/courseFooter',
                courseRoutes: ['scores', 'dictionary'],
            },
        ],
    })

    k('unitCourse: ', unitCourse)

    courses.push(cloneObj(unitCourse))

    courseIndex++
})

k('courses: ', courses)


let coursesIDS = [
    138345,
    137222,
    137279,
    145363
]


courses.forEach((course, index) => {
    k('course: ', course)
    var filepath = `./output/${coursesIDS[index]}.js`
    var fileContent = `export default ${JSON.stringify(course, null, 2)}`
    writeFile(filepath, fileContent, function() {})
})
