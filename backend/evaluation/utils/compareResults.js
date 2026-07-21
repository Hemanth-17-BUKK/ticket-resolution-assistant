function containsKeyword(text, keyword) {

    if (!text) {

        return false;

    }

    return text
        .toLowerCase()
        .includes(keyword.toLowerCase());

}

function compareResults(expected, actual, latency) {

    const reply =

        actual.draftReply ||

        actual.finalReply ||

        actual.response ||

        "";

    const expectedKeywords =

        expected.replyKeywords || [];

    const matchedKeywords =

        expectedKeywords.filter(

            keyword => containsKeyword(reply, keyword)

        );

    return {

        ticketId:

            actual.ticketId,

        latency,

        expected,

        actual: {

            category:

                actual.category,

            priority:

                actual.priority,

            sentiment:

                actual.sentiment,

            confidence:

                actual.aiConfidence || 0,

            status:

                actual.status,

            reply

        },

        categoryCorrect:

            expected.category.toUpperCase() ===
            (actual.category || "").toUpperCase(),

        priorityCorrect:

            expected.priority.toUpperCase() ===
            (actual.priority || "").toUpperCase(),

        sentimentCorrect:

            expected.sentiment.toUpperCase() ===
            (actual.sentiment || "").toUpperCase(),

        keywordScore:

            expectedKeywords.length === 0

                ? 100

                : Math.round(

                    (matchedKeywords.length /

                        expectedKeywords.length) * 100

                ),

        matchedKeywords,

        confidence:

            actual.aiConfidence || 0

    };

}

module.exports = compareResults;