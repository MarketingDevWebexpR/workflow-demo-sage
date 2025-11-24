
(function () {

    /*
        ici ce seront les variables à portée globale pour faire fonctionner
        le workflow géré à partir du texte formaté
    */
    var abc = [];
    var xyzv = null;


    /*
        ici ce sera le workflow géré à partir du texte formaté,
        qui pourra utilisé les variables injectées mises à
        disposition
    */
    return function* (folder, preDefinedSwitchValues) {

        yield new WorkflowBoundary({ "id": "BOUNDARY_46475602-0364-4f49-9b28-d18533bd6835", "title": "Position opened" });

        yield new WorkflowAction({ "id": "ACTION_25225d02-1a2a-4ec0-8282-19e34de7681c", "type": "createJobPosting", "title": "Create Job Posting" });

        yield new WorkflowAction({ "id": "ACTION_2f9fab60-adba-4139-9d97-25b5855908c7", "type": "reviewJobDescription", "title": "Review Job Description with Hiring Manager" });

        const switch_647029d6_fd3f_4715_a222_54f3d03930b1 = new WorkflowSwitch({ "id": "SWITCH_3c6d80bc-e96e-4e35-b1dc-e26862e729c0", "title": "Needs budget approval for this position?" });

        yield switch_647029d6_fd3f_4715_a222_54f3d03930b1;
        switch_647029d6_fd3f_4715_a222_54f3d03930b1.setSwitchValue(preDefinedSwitchValues);

        if (switch_647029d6_fd3f_4715_a222_54f3d03930b1.getSwitchValue()) {
            yield new WorkflowAction({ "id": "ACTION_98ff8209-0352-4965-b3f7-cd52f80bfa7a", "type": "requestBudgetApproval", "title": "Request Budget Approval" });
            yield new WorkflowStatus({ "id": "STATUS_96a71db2-0379-48ff-a469-b047311f035b", "title": "Awaiting Budget Approval" });
            yield new WorkflowAction({ "id": "ACTION_12c9342e-8c8d-4ea5-8a24-e40b59176e11", "type": "approveBudget", "title": "Approve Budget" });
        }

        yield new WorkflowAction({ "id": "ACTION_caca5314-5e88-4a15-8fa8-7450805a9856", "type": "publishJobPosting", "title": "Publish Job Posting on Job Boards" });

        yield new WorkflowStatus({ "id": "STATUS_d6bd892c-5de5-49a6-b9b6-8ff1e669eb2b", "title": "Accepting Applications" });

        yield new WorkflowAction({ "id": "ACTION_c43b5872-faba-4a62-bfda-7b7c98efc92b", "type": "collectApplications", "title": "Collect and Screen Applications" });

        yield new WorkflowAction({ "id": "ACTION_2f3e6bd6-e806-489d-bc94-5b8ce415bd51", "type": "performInitialScreening", "title": "Perform Initial CV Screening" });

        const switch_114de0b6_9643_44a3_923e_ee7bc577c5a2 = new WorkflowSwitch({ "id": "SWITCH_e4018546-d033-4452-9a61-fdf214e125b1", "title": "Do we have enough qualified candidates?" });

        yield switch_114de0b6_9643_44a3_923e_ee7bc577c5a2;
        switch_114de0b6_9643_44a3_923e_ee7bc577c5a2.setSwitchValue(preDefinedSwitchValues);

        if (switch_114de0b6_9643_44a3_923e_ee7bc577c5a2.getSwitchValue()) {

            yield new WorkflowAction({ "id": "ACTION_d53ef9ae-4e11-486d-a5a4-53843776ed10", "type": "selectCandidatesForInterview", "title": "Select Candidates for First Interview" });
            yield new WorkflowStatus({ "id": "STATUS_8adabd31-3fc0-441e-b83d-5dc1ed9e73b2", "title": "Scheduling Interviews" });
            yield new WorkflowAction({ "id": "ACTION_ed6ce237-81fd-4fbe-ad0a-e4c9ae49afdb", "type": "schedulePhoneScreening", "title": "Schedule Phone Screening" });
            yield new WorkflowAction({ "id": "ACTION_a2eb35b6-13df-418a-8348-1007bbc3bfbe", "type": "conductPhoneScreening", "title": "Conduct Phone Screening" });
            const switch_e0f97311_f6a1_4753_9384_4d7547a098a1 = new WorkflowSwitch({ "id": "SWITCH_bac7990d-aa06-470b-8226-ef29ab68bb6b", "title": "Did candidate pass phone screening?" });
            yield switch_e0f97311_f6a1_4753_9384_4d7547a098a1;
            switch_e0f97311_f6a1_4753_9384_4d7547a098a1.setSwitchValue(preDefinedSwitchValues);
            if (switch_e0f97311_f6a1_4753_9384_4d7547a098a1.getSwitchValue()) {
                yield new WorkflowAction({ "id": "ACTION_6187978b-d273-4626-845d-613330c4fd8b", "type": "scheduleTechnicalInterview", "title": "Schedule Technical Interview" });
                yield new WorkflowStatus({ "id": "STATUS_f233792c-f0fd-4a50-a3b5-abdefd713048", "title": "Technical Interview Stage" });
                yield new WorkflowAction({ "id": "ACTION_2f4ce460-8860-40b3-80bf-3b07b3a5d461", "type": "conductTechnicalInterview", "title": "Conduct Technical Interview" });
                const switch_4543e9f5_5010_4670_b80d_1b9978833c00 = new WorkflowSwitch({ "id": "SWITCH_f089ab17-4830-4c7a-9d52-2d59442648aa", "title": "Did candidate pass technical interview?" });
                yield switch_4543e9f5_5010_4670_b80d_1b9978833c00;
                switch_4543e9f5_5010_4670_b80d_1b9978833c00.setSwitchValue(preDefinedSwitchValues);
                if (switch_4543e9f5_5010_4670_b80d_1b9978833c00.getSwitchValue()) {
                    const switch_b868b352_51f8_496f_b7ad_8808acc192fc = new WorkflowSwitch({ "id": "SWITCH_bc58e884-4559-4771-b13c-bcbb579ca015", "title": "Is this a senior role?" });
                    yield switch_b868b352_51f8_496f_b7ad_8808acc192fc;
                    switch_b868b352_51f8_496f_b7ad_8808acc192fc.setSwitchValue(preDefinedSwitchValues);
                    if (switch_b868b352_51f8_496f_b7ad_8808acc192fc.getSwitchValue()) {
                        yield new WorkflowAction({ "id": "ACTION_40505762-f763-4d4d-988d-87dd5a06341e", "type": "schedulePanelInterview", "title": "Schedule Panel Interview" });
                        yield new WorkflowAction({ "id": "ACTION_98255eb3-7cfa-49e0-9866-2175d1665ce4", "type": "conductPanelInterview", "title": "Conduct Panel Interview" });
                    }
                    yield new WorkflowAction({ "id": "ACTION_4bc3bcca-1161-4432-ba8a-e2dd7ba2fb52", "type": "scheduleCultureFitInterview", "title": "Schedule Culture Fit Interview" });
                    yield new WorkflowAction({ "id": "ACTION_10421c63-2b97-4108-bebd-1712057e0d04", "type": "conductCultureFitInterview", "title": "Conduct Culture Fit Interview" });
                    yield new WorkflowStatus({ "id": "STATUS_bd28f486-5712-498b-b4f4-930d341e4dfc", "title": "Final Candidate Review" });
                    yield new WorkflowAction({ "id": "ACTION_b1c96ee9-0d5c-4d5f-a5b6-ec5da9103eec", "type": "gatherTeamConsensus", "title": "Gather Team Consensus" });
                    const switch_09d4584e_c9ce_4bd7_8ee6_3671ca5bd754 = new WorkflowSwitch({ "id": "SWITCH_46d986ba-1c0f-4127-9af3-7ded25008d75", "title": "Did the team approve this candidate?" });
                    yield switch_09d4584e_c9ce_4bd7_8ee6_3671ca5bd754;
                    switch_09d4584e_c9ce_4bd7_8ee6_3671ca5bd754.setSwitchValue(preDefinedSwitchValues);
                    if (switch_09d4584e_c9ce_4bd7_8ee6_3671ca5bd754.getSwitchValue()) {
                        yield new WorkflowAction({ "id": "ACTION_6bac4c0d-6305-4f06-bbed-5c44a11b5591", "type": "conductReferenceCheck", "title": "Conduct Reference Checks" });
                        yield new WorkflowAction({ "id": "ACTION_0ae8967c-f562-402f-8a31-e526822f010d", "type": "prepareJobOffer", "title": "Prepare Job Offer" });
                        yield new WorkflowStatus({ "id": "STATUS_3270a4c0-4bef-4933-9928-215659ad60c7", "title": "Offer Preparation" });
                        yield new WorkflowAction({ "id": "ACTION_19ce909d-d76e-4716-baff-054373a5bd46", "type": "getOfferApproval", "title": "Get Offer Approval from Leadership" });
                        yield new WorkflowAction({ "id": "ACTION_e5590b64-0a2f-4726-87a7-d68f5089c9cd", "type": "extendOffer", "title": "Extend Offer to Candidate" });
                        yield new WorkflowStatus({ "id": "STATUS_8cf6c6e8-17a9-4e14-8aa0-5a5683589853", "title": "Offer Extended" });
                        const switch_35ed0b94_4799_4bda_b1ab_5e90ba484d06 = new WorkflowSwitch({ "id": "SWITCH_b5f86a71-217a-44df-b14d-c1163d07ad3d", "title": "Did candidate accept the offer?" });
                        yield switch_35ed0b94_4799_4bda_b1ab_5e90ba484d06;
                        switch_35ed0b94_4799_4bda_b1ab_5e90ba484d06.setSwitchValue(preDefinedSwitchValues);
                        if (switch_35ed0b94_4799_4bda_b1ab_5e90ba484d06.getSwitchValue()) {
                            yield new WorkflowAction({ "id": "ACTION_4379d3a8-5bd4-47aa-89ac-b1707726b72b", "type": "sendEmploymentContract", "title": "Send Employment Contract" });
                            yield new WorkflowAction({ "id": "ACTION_34927269-e4d5-4a3d-a629-64d1bda35a0b", "type": "initiateBackgroundCheck", "title": "Initiate Background Check" });
                            yield new WorkflowStatus({ "id": "STATUS_f76103e8-7195-4353-872e-00ee4550474f", "title": "Awaiting Background Check Results" });
                            yield new WorkflowAction({ "id": "ACTION_b948f85b-21c9-4a28-ad41-01f9ea7c822d", "type": "reviewBackgroundCheck", "title": "Review Background Check Results" });
                            yield new WorkflowAction({ "id": "ACTION_0d08f6b3-b832-4792-8809-ff9e7427ba05", "type": "finalizeHiring", "title": "Finalize Hiring Process" });
                            yield new WorkflowStatus({ "id": "STATUS_03571fda-73b7-4db8-8246-04ebbf636d35", "title": "Hire Confirmed" });
                            yield new WorkflowAction({ "id": "ACTION_a867dca6-1574-4c9d-8cfd-9add8df91331", "type": "notifyTeamOfNewHire", "title": "Notify Team of New Hire" });
                            yield new WorkflowAction({ "id": "ACTION_087851a4-2447-44a7-bb9d-dbe315d3d406", "type": "scheduleStartDate", "title": "Schedule Start Date" });
                            yield new WorkflowAction({ "id": "ACTION_88e51bde-baf1-46b9-8c85-863228874b56", "type": "prepareOnboarding", "title": "Prepare Onboarding Materials" });
                        } else {
                            yield new WorkflowAction({ "id": "ACTION_06b5dd7f-2a19-459c-b7e5-e5ec5b2925fb", "type": "negotiateOffer", "title": "Negotiate Offer Terms" });
                            yield new WorkflowStatus({ "id": "STATUS_15baf623-d3c4-4eea-b5a2-546a829c473d", "title": "In Negotiation" });
                        }
                    } else {
                        yield new WorkflowAction({ "id": "ACTION_d9f1d384-9172-42cf-b0b7-776653dd8523", "type": "sendRejectionEmail", "title": "Send Polite Rejection Email" });
                    }
                } else {
                    yield new WorkflowAction({ "id": "ACTION_d32fe788-a55e-4700-8177-2a13d6311e7b", "type": "provideFeedback", "title": "Provide Constructive Feedback" });
                    yield new WorkflowAction({ "id": "ACTION_2781a0a6-1e77-4d23-91dc-d2fdad040113", "type": "sendRejectionEmail", "title": "Send Rejection Email" });
                }
            } else {
                yield new WorkflowAction({ "id": "ACTION_26e8767c-6ba3-41bd-8a6e-74de37e9c102", "type": "sendRejectionEmail", "title": "Send Rejection Email" });
            }
        } else {
            yield new WorkflowAction({ "id": "ACTION_3e739da4-c5da-47a0-aaf4-bbf3e98f9560", "type": "extendApplicationDeadline", "title": "Extend Application Deadline" });
            yield new WorkflowAction({ "id": "ACTION_861571c7-bc2a-471d-8128-5ee71953cd52", "type": "expandJobSearch", "title": "Expand Job Search to More Channels" });
            yield new WorkflowStatus({ "id": "STATUS_c37a8917-b66f-45e4-87ff-80cda0435abd", "title": "Search Extended" });
        }
        yield new WorkflowAction({ "id": "ACTION_bde7b94b-7eb1-4703-9ac8-ac4ba882f5bf", "type": "closePosition", "title": "Close Position" });
        yield new WorkflowStatus({ "id": "STATUS_32b41c01-1eed-4a4d-aa26-2c866427d1ec", "title": "Position Filled" });
        yield new WorkflowAction({ "id": "ACTION_400c718e-def1-4981-8db7-799844b47936", "type": "archiveApplications", "title": "Archive All Applications" });
        yield new WorkflowBoundary({ "id": "BOUNDARY_1794ab0b-8173-467f-a71f-7c2e176ea53f", "title": "Recruitment completed" });
    };

})()
