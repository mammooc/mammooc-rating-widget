import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
 * Mixin that acts as base class for all mammooc elements to provide localization
 *
 * @polymer
 * @mixinFunction
 * @param  {PolymerElement | Function} BaseClass The base class to extend.
 * @return {Function}                            The extended base class.
 */
export const MammoocLocalizeMixin = (BaseClass) => class extends mixinBehaviors([
    AppLocalizeBehavior
], BaseClass) {
    static get properties() {
        return {
            /** The language to use for display */
            language: {
                type: String,
                value() {
                    let lang = document.documentElement.lang || 'en';
                    const availableLanguages = ['en', 'de', 'fr', 'zh'];

                    // Use correct language code for Chinese (needed for openHPI)
                    if (lang === 'cn') {
                        lang = 'zh';
                    }

                    // Fallback to english if language not available
                    if (availableLanguages.indexOf(lang) === -1) {
                        lang = 'en';
                    }

                    return lang;
                }
            },
            /** A dictionary containing the translations for various languages */
            resources: {
                type: Object,
                value() {
                    return {
                        'en': {
                            'noevaluations': 'No evaluations yet',
                            'poweredby': 'Powered by ',
                            'courseevaluations': 'Course evaluations',
                            'ratings': 'Ratings:',
                            'yourrating': 'Your rating',
                            'status': 'Status:',
                            'aborted': 'Aborted',
                            'enrolled': 'Enrolled',
                            'finished': 'Finished',
                            'submitanonymously': 'Submit anonymously',
                            'submit': 'Submit',
                            'descriptionplaceholder': 'The course was...',
                            'descriptionlabel': 'Your course evaluation',
                            'successtext': 'Your evaluation was successfully saved.',
                            'seeall': 'See all'
                        },
                        'de': {
                            'noevaluations': 'Noch keine Evaluierungen',
                            'poweredby': 'Unterstützt von ',
                            'courseevaluations': 'Kurs-Evaluierungen',
                            'ratings': 'Bewertungen:',
                            'yourrating': 'Deine Bewertung',
                            'status': 'Status:',
                            'aborted': 'Abgebrochen',
                            'enrolled': 'Gerade belegt',
                            'finished': 'Abgeschlossen',
                            'submitanonymously': 'Anonym bewerten',
                            'submit': 'Abschicken',
                            'descriptionplaceholder': 'Der Kurs war...',
                            'descriptionlabel': 'Deine Kurs-Evaluierung',
                            'successtext': 'Deine Evaluierung wurde erfolgreich gespeichert.',
                            'seeall': 'Alle anzeigen'
                        },
                        'fr': {
                            'noevaluations': 'Aucun Evaluation',
                            'poweredby': 'opéré par ',
                            'courseevaluations': 'Évaluations du Cours',
                            'ratings': 'Classifications:',
                            'yourrating': 'Votre classification',
                            'status': 'Statut:',
                            'aborted': 'Annule',
                            'enrolled': 'Enregistré',
                            'finished': 'Terminé',
                            'submitanonymously': 'À soumettre de façon anonyme',
                            'submit': 'Soumettre',
                            'descriptionplaceholder': 'Le cours a été...',
                            'descriptionlabel': 'Votre évaluation du cours…',
                            'successtext': 'Votre évaluation a été sauvegarder avec succès.',
                            'seeall': 'Voir tous'
                        },
                        'zh': {
                            'noevaluations': ' 暂无评价',
                            'poweredby': '支持方',
                            'courseevaluations': '课程评价',
                            'ratings': '评分：',
                            'yourrating': '您的评分',
                            'status': '状态：',
                            'aborted': '已辍学',
                            'enrolled': '已注册',
                            'finished': '已完成',
                            'submitanonymously': '匿名提交',
                            'submit': '提交',
                            'descriptionplaceholder': '该课程…',
                            'descriptionlabel': '您的课程评价',
                            'successtext': '已成功保存您的评价。',
                            'seeall': '查看全部'
                        }
                    };
                }
            }
        };
    }
};
